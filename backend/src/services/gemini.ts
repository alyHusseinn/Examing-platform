import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

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

// Configuration
const API_KEY = "AIzaSyCXvzx8t_Q82yqI0BiMKgadzSF8uVKA1qg";
const MODEL_NAME = 'gemini-pro';

// Initialize AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: MODEL_NAME });

class AIService {
  private static createStructuredQuestionPrompt(subject: string, topic: string, difficulty: string): string {
    return `You are a JSON generator for an educational platform. Your task is to generate multiple choice questions.

REQUIREMENTS:
1. Generate exactly 10 multiple choice questions for ${subject} about ${topic} at ${difficulty} level
2. Each question must have exactly 4 options
3. The correctAnswer must be a number (0-3) representing the index of the correct option
4. Include exactly 3 learning resources
5. Respond ONLY with valid JSON, no additional text or markdown

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
    "Resource URL or description 1",
    "Resource URL or description 2",
    "Resource URL or description 3"
  ]
}

VALIDATION RULES:
- No markdown delimiters
- No explanatory text
- Pure JSON only
- Exactly 10 questions
- Exactly 4 options per question
- correctAnswer must be 0, 1, 2, or 3 
- Exactly 3 resources

Generate the JSON now:
`;
  }

  private static validateQuestionResponse(data: any): boolean {
    // Check basic structure
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.questions) || !Array.isArray(data.resources)) return false;

    // Validate questions count
    if (data.questions.length !== 10) return false;

    // Validate resources count
    if (data.resources.length !== 3) return false;

    // Validate each question
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
    maxAttempts: number = 3
  ): Promise<QuestionResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Try to parse the response as JSON
        let parsedResponse: any;
        try {
          // Clean the response: remove any potential markdown or extra text
          const cleanedResponse = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          parsedResponse = JSON.parse(cleanedResponse);
        } catch (parseError: unknown) {
          if (parseError instanceof Error) {
            throw new Error(`JSON parse error: ${parseError.message}`);
          }
          throw new Error('JSON parse error: Unknown error');
        }

        // Validate the structure
        if (!this.validateQuestionResponse(parsedResponse)) {
          throw new Error('Invalid response structure');
        }

        return parsedResponse;

      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Attempt ${attempt} failed: ${lastError.message}`);

        // On failure, modify the prompt to be more explicit
        if (attempt < maxAttempts) {
          prompt += '\n\nPREVIOUS ATTEMPT FAILED. Remember: Respond with ONLY valid JSON, no additional text. Ensure exactly 10 questions, 4 options each, and 3 resources.';
        }
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
  }

  static async generateQuestions(
    subject: string,
    topic: string,
    difficulty: 'easy' | 'intermediate' | 'hard'
  ): Promise<QuestionResponse> {
    try {
      // Input validation
      if (!subject || !topic || !difficulty) {
        throw new Error('Missing required parameters');
      }

      const prompt = this.createStructuredQuestionPrompt(subject, topic, difficulty);
      return await this.retryGeneration(prompt);

    } catch (error: any) {
      console.error('Question generation error:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  static async askAiAboutSubject(subject: string, question: string): Promise<string> {
    const prompt = `As an educational assistant, provide a concise explanation about ${subject}.
    
REQUIREMENTS:
- Answer the following question: ${question}
- Keep the response under 250 words
- Focus on key points only
- Use simple, clear language
- Do not include any introductory phrases or conclusions
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Ensure we're not exceeding length
      return response.slice(0, 1000); // Additional safety limit
    } catch (error: any) {
      console.error('Question generation error:', error);
      throw new Error(`Failed to answer question: ${error.message}`);
    }
  }
}


export { AIService };