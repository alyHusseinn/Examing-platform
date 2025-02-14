import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateQuestions = async (subject: string, topic: string, difficulty: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate 10 multiple choice questions for ${subject} on the topic of ${topic} at ${difficulty} difficulty level and the resources to learn more about the topic. 
    Format the response as a JSON array with the following structure for each question:
    {
      "questions": [{
        "text": "question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": 0-3,
      }],
      "resources": ["resource link1", "resource link2", "resource link3"]
    }`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  console.log(response.text());
  return JSON.parse(response.text());
};

export const getChatbotResponse = async (subject: string, question: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `As a tutor specializing in ${subject}, please help answer this question: ${question}
    Provide a clear, concise explanation that a student can understand.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};