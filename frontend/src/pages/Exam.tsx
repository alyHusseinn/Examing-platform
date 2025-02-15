import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { exams } from '../lib/api';
import type { Exam as ExamType, ExamScore } from '../types';

export default function Exam() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get('difficulty') || 'easy';
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: exam, isLoading: examLoading } = useQuery<ExamType>({
    queryKey: ['exam', id, difficulty],
    queryFn: () => exams.getById(id!, difficulty),
  });

  const submitMutation = useMutation({
    mutationFn: (data: { answers: Record<string, string> }) =>
      exams.submit(id!, difficulty, data),
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (examLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load exam. Please try again later.
      </div>
    );
  }

  const handleSubmit = () => {
    submitMutation.mutate({ answers });
  };

  const difficultyColor = {
    easy: 'text-green-600',
    intermediate: 'text-yellow-600',
    hard: 'text-red-600',
  }[difficulty];

  if (submitted) {
    const score = (submitMutation.data as ExamScore)?.score || 0;
    const passed = score >= 7;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-lg p-8 text-center transform transition-all duration-500 hover:scale-105">
          {passed ? (
            <>
              <div className="animate-bounce mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Congratulations! 🎉
                </h2>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-red-600">Keep Practicing!</h2>
              <div className="mb-6 space-y-4">
                <p className="text-lg">
                  Here are some resources to help you improve:
                </p>
                <div className="space-y-3">
                  {exam.resources?.map((resource, index) => (
                    <a
                      key={index}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{resource}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
          <p className="text-lg mb-6">
            You scored <span className="font-bold text-indigo-600 text-xl">{score}/10</span> on this exam.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Return to Subject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            <span className={difficultyColor}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span> Exam
          </h1>

          <div className="flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2">
            <AlertCircle className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span className="text-sm text-indigo-600 font-medium">Score 7/10 to advance!</span>
          </div>
        </div>

        {/* Question section */}
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-200 bg-white"
            >
              <p className="text-lg font-medium mb-4">
                <span className="text-indigo-600 font-bold mr-2">Q{index + 1}.</span>
                {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === optionIndex.toString()}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [index]: optionIndex.toString(),
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 hover:text-indigo-700 transition-colors duration-200">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== exam.questions.length}
            className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
          >
            <span className="flex items-center space-x-2">
              <span>Submit Exam</span>
              {Object.keys(answers).length === exam.questions.length && (
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}