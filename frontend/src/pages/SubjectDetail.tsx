import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { subjects, chatbot } from '../lib/api';
import type { Subject } from '../types';
import { useAuthStore } from '../store/auth';
const difficultyColors = {
  easy: 'bg-green-50 text-green-700 ring-green-600/20',
  intermediate: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  hard: 'bg-red-50 text-red-700 ring-red-600/20',
};

const difficultyLabels = {
  easy: 'Beginner',
  intermediate: 'Intermediate',
  hard: 'Advanced',
};

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<Array<{ question: string; answer: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  
  const { data: subject, isLoading: isSubjectLoading, error } = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjects.getById(id!),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !subject) return;

    setIsLoading(true);
    try {
      const response = await chatbot.ask(subject.name, question);
      const currentQuestion = question;
      setQuestion('');
      
      setChatHistory(prev => [...prev, { 
        question: currentQuestion, 
        answer: response.response
      }]);
    } catch (error) {
      console.error('Failed to get response:', error);
      alert('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log(subject);

  if (isSubjectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load subject details. Please try again later.
      </div>
    );
  }

  const currentLevel = subject.level || 0;
  const difficulties = ['easy', 'intermediate', 'hard'] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-[1.01]">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-indigo-50 rounded-lg animate-pulse">
            <BookOpen className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
            <p className="text-gray-600 mt-1">{subject.description}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="h-5 w-5 text-indigo-600 animate-bounce" />
            <h2 className="text-lg font-semibold text-gray-900">Your Learning Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((difficulty, index) => {
              const isUnlocked = isAdmin || index <= currentLevel;
              const isCompleted = index < currentLevel;
              const isNext = !isAdmin && index === currentLevel;

              return (
                <div
                  key={difficulty}
                  className={`relative rounded-lg border p-4 transition-all duration-200 ${
                    isUnlocked 
                      ? 'bg-white cursor-pointer hover:border-indigo-500 hover:shadow-lg transform hover:-translate-y-1' 
                      : 'bg-gray-50'
                  } ${isNext ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}
                  onClick={() => isUnlocked && navigate(`/exams/${subject._id}?difficulty=${difficulty}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${
                          difficultyColors[difficulty]
                        }`}
                      >
                        {difficultyLabels[difficulty]}
                      </span>
                      {isCompleted && !isAdmin && (
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          ✨ Mastered!
                        </span>
                      )}
                      {isAdmin && (
                        <span className="ml-2 text-sm text-indigo-600 font-medium">
                          View Results
                        </span>
                      )}
                    </div>
                    {isUnlocked && (
                      <ArrowRight className="h-5 w-5 text-indigo-600 animate-pulse" />
                    )}
                  </div>
                  {!isUnlocked && !isAdmin && (
                    <div className="absolute inset-0 bg-gray-50/90 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">🔒 Coming Soon</span>
                    </div>
                  )}
                  {isNext && !isAdmin && (
                    <div className="mt-2 text-sm text-indigo-600">
                      Ready for your next challenge! 💪
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask Questions About {subject.name}</h2>
        
        <div className="space-y-4 mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">You: {chat.question}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-900">AI: {chat.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about this subject..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
}