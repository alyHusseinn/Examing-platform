import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import 'dotenv/config';
// Types
interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionResponse {
  questions: Question[];
  resources: string[];
}

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

// Configuration
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-pro';

// Default retry configuration
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 8,        // Increased from 5 to 8
  initialDelay: 2000,    // Increased from 1000 to 2000
  maxDelay: 60000,       // Increased from 32000 to 60000
  backoffFactor: 1.5     // Decreased from 2 to 1.5 for more gradual backoff
};

// Initialize AI
const genAI = new GoogleGenerativeAI(API_KEY as string);
const model: GenerativeModel = genAI.getGenerativeModel({ model: MODEL_NAME });

class AIService {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static calculateBackoff(attempt: number, options: RetryOptions): number {
    const backoffDelay = options.initialDelay * Math.pow(options.backoffFactor, attempt - 1);
    // Add jitter (randomization) to prevent thundering herd problem
    const jitter = Math.random() * 1000; // Random delay between 0-1000ms
    return Math.min(backoffDelay + jitter, options.maxDelay);
  }

  private static isRetryableError(error: any): boolean {
    const retryableStatusCodes = [408, 429, 503, 504];
    return (
      error?.message?.includes('Service Unavailable') ||
      error?.message?.includes('overloaded') ||
      error?.message?.includes('rate limit') ||
      error?.message?.includes('timeout') ||
      (error?.status && retryableStatusCodes.includes(error.status))
    );
  }

  private static createStructuredQuestionPrompt(subject: string, topic: string, difficulty: string): string {
    return `
    You are a JSON generator for an educational platform. Your task is to generate multiple-choice questions.

    REQUIREMENTS:
    1. Generate exactly 10 multiple-choice questions for ${subject} about ${topic} at ${difficulty} level.
    2. Each question must have exactly 4 unique answer choices.
    3. The "correctAnswer" must be an integer (0-3) representing the index of the correct answer.
    4. 5 resources must be included, courses, videos, articles, etc.
    5. Respond **ONLY** with valid JSON—no additional text, no Markdown, no explanations.

    STRICT JSON STRUCTURE:
    {
      "questions": [
        {
          "text": "Your question here?",
          "options": [
            "First option",
            "Second option",
            "Third option",
            "Fourth option"
          ],
          "correctAnswer": 0
        }
      ],
      "resources": [
        "resource 1 URL",
        "resource 2 URL",
        "resource 3 URL",
      ]
    }`;
  }

  private static validateQuestionResponse(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.questions) || !Array.isArray(data.resources)) return false;
    if (data.questions.length !== 10) return false;

    return data.questions.every((q: any) => {
      return (
        typeof q.text === 'string' &&
        q.text.length > 0 &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((opt: any) => typeof opt === 'string' && opt.length > 0) &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3
      );
    });
  }

  private static async retryGeneration(
    prompt: string,
    retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<QuestionResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        try {
          const cleanedResponse = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          const parsedResponse = JSON.parse(cleanedResponse);

          if (!this.validateQuestionResponse(parsedResponse)) {
            throw new Error('Invalid response structure');
          }

          return parsedResponse;

        } catch (parseError: unknown) {
          throw new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }

      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === retryOptions.maxAttempts || !this.isRetryableError(error)) {
          throw lastError;
        }

        const backoffDelay = this.calculateBackoff(attempt, retryOptions);
        console.warn(`Attempt ${attempt} failed: ${lastError.message}. Retrying in ${backoffDelay}ms...`);
        
        await this.delay(backoffDelay);
        
        // Modify prompt for next attempt
        prompt += '\n\nPREVIOUS ATTEMPT FAILED. Remember: Respond with ONLY valid JSON, no additional text.';
      }
    }

    throw lastError || new Error('Unknown error occurred during generation');
  }

  static async generateQuestions(
    subject: string,
    topic: string,
    difficulty: 'easy' | 'intermediate' | 'hard',
    retryOptions?: RetryOptions
  ): Promise<QuestionResponse> {
    if (!subject || !topic || !difficulty) {
      throw new Error('Missing required parameters');
    }

    try {
      const prompt = this.createStructuredQuestionPrompt(subject, topic, difficulty);
      return await this.retryGeneration(prompt, retryOptions);
    } catch (error: any) {
      console.error('Question generation error:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  static async askAiAboutSubject(
    subject: string,
    question: string,
    retryOptions?: RetryOptions
  ): Promise<string> {
    const prompt = `As an educational assistant, provide a concise explanation about ${subject}.
    
    REQUIREMENTS:
    - Answer the following question: ${question}
    - Keep the response under 250 words
    - Focus on key points only
    - Use simple, clear language
    - Do not include any introductory phrases or conclusions`;

    try {
      let result;
      for (let attempt = 1; attempt <= (retryOptions?.maxAttempts || DEFAULT_RETRY_OPTIONS.maxAttempts); attempt++) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (error: any) {
          if (attempt === (retryOptions?.maxAttempts || DEFAULT_RETRY_OPTIONS.maxAttempts) || !this.isRetryableError(error)) {
            throw error;
          }
          const backoffDelay = this.calculateBackoff(attempt, retryOptions || DEFAULT_RETRY_OPTIONS);
          console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${backoffDelay}ms...`);
          await this.delay(backoffDelay);
        }
      }

      if (!result) {
        throw new Error('Failed to generate content after all retry attempts');
      }

      return result.response.text().slice(0, 1000);
    } catch (error: any) {
      console.error('AI response generation error:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
}

export { AIService, type RetryOptions };