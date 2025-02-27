import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Updated configuration
const API_KEY = process.env.OPENAPI_ROUTER_API_KEY;
const MODEL_NAME = 'qwen/qwen2.5-vl-72b-instruct:free';

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 8,
  initialDelay: 2000,
  maxDelay: 60000,
  backoffFactor: 1.5
};

class AIService {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static calculateBackoff(attempt: number, options: RetryOptions): number {
    const backoffDelay = options.initialDelay * Math.pow(options.backoffFactor, attempt - 1);
    const jitter = Math.random() * 1000;
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
    Respond **ONLY** with valid JSON. No extra text.
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

  private static async makeOpenRouterRequest(messages: any[]): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages 
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async retryGeneration(
    messages: any[],
    retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<QuestionResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
      try {
        const response = await this.makeOpenRouterRequest(messages);
        const cleanedResponse = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
        console.log(cleanedResponse)

        try {
          const parsedResponse = JSON.parse(cleanedResponse);
          if (!this.validateQuestionResponse(parsedResponse)) {
            throw new Error('Invalid response structure');
          }
          return parsedResponse;
        } catch (parseError: unknown) {
          lastError = new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
          console.warn(`Attempt ${attempt} failed due to JSON parsing error. Retrying...`);
        }
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt === retryOptions.maxAttempts || !this.isRetryableError(error)) {
          throw lastError;
        }
      }

      const backoffDelay = this.calculateBackoff(attempt, retryOptions);
      await this.delay(backoffDelay);
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

    const prompt = this.createStructuredQuestionPrompt(subject, topic, difficulty);
    const messages = [{
      role: "user",
      content: prompt
    }];

    return await this.retryGeneration(messages, retryOptions);
  }

  static async askAiAboutSubject(
    subject: string,
    question: string,
    retryOptions?: RetryOptions
  ): Promise<string> {
    const prompt = `As an educational assistant, provide a concise explanation about ${subject}.\n\nQuestion: ${question}`;
    const messages = [{
      role: "user",
      content: prompt
    }];

    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL! });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error: any) {
      console.error('AI response generation error:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
}

export { AIService, type RetryOptions };