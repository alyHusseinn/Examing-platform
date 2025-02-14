export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
}

export interface Exam {
  id: string;
  subject: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  score: number;
  answers: number[];
  completedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: string[];
}