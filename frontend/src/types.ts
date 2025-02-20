export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  points: number;
  token: string;
}

export interface Subject {
  _id: string;
  name: string;
  description: string;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer?: string;
}

export interface Exam {
  _id: string;
  subject: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  questions: Question[];
  courses: string[];
  articles: string[];
}

export interface ExamAttempt {
  _id: string;
  user: User;
  score: number;
  completed?: boolean;
  answers?: Record<string, string>;
}

export interface ExamSubmission {
  answers: Record<string, string>;
}

export interface ExamScore {
  score: number;
}