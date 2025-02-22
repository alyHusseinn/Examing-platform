import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { exams } from "../lib/api";
import type { Exam as ExamType, Question, ExamAttempt } from "../types";
import { useAuthStore } from "../store/auth";
import { useTranslation } from '../hooks/useTranslation';

export default function Exam() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get("difficulty") || "easy";

  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: exam, isLoading: examLoading } = useQuery<ExamType>({
    queryKey: ["exam", id, difficulty],
    queryFn: () => exams.getById(id!, difficulty),
  });

  const { data: adminData } = useQuery({
    queryKey: ["examAdmin", id, difficulty],
    queryFn: () => exams.getAdminData(id!, difficulty),
    enabled: isAdmin,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { answers: Record<string, string> }) =>
      exams.submit(id!, difficulty, data),
    onSuccess: (data) => {
      // Navigate to results page with score and resources
      navigate("/exam-results", {
        state: {
          score: data.score,
          resources: exam?.resources,
        },
      });
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
        {t('exam.error')}
      </div>
    );
  }

  const handleSubmit = () => {
    submitMutation.mutate({ answers });
  };

  const difficultyColor = {
    easy: "text-green-600",
    intermediate: "text-yellow-600",
    hard: "text-red-600",
  }[difficulty];

  if (submitMutation.isSuccess) {
    const score = submitMutation.data.score;
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
                  {t('exam.congratulations')}
                </h2>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                {t('exam.keepLearning')}
              </h2>
              <div className="mb-6 space-y-4">
                <p className="text-lg">
                  {t('exam.dontWorry')}
                </p>
                <div className="space-y-3">
                  {exam.resources?.map((resource: string, index: number) => (
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
                            <span className="text-indigo-600 font-semibold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {resource}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
          <p className="text-lg mb-6">
            {t('exam.score')}
            <span className="font-bold text-indigo-600 text-xl">
              {score}/{exam.questions.length}
            </span>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            {t('exam.returnToSubject')}
          </button>
        </div>
      </div>
    );
  }

  console.log(adminData);

  if (isAdmin && exam) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        <div className="bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-lg p-6 border border-indigo-500">
          <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {t('exam.adminView.title')}
          </h1>

          <div className="space-y-6">
            {adminData?.exam.questions.map(
              (question: Question, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <p className="text-lg font-medium mb-4">
                    <span className="text-indigo-600 font-bold mr-2">
                      {t('exam.question')}
                      {index + 1}.
                    </span>
                    {question.text}
                  </p>
                  <div className="space-y-2">
                    {question.options.map(
                      (option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg ${
                            question.correctAnswer == optionIndex.toString()
                              ? "bg-green-50 border border-green-200"
                              : ""
                          }`}
                        >
                          <span className="text-gray-700">
                            {option}
                            {question.correctAnswer ==
                              optionIndex.toString() && (
                              <span className="ml-2 text-green-600 font-medium">
                                (Correct Answer)
                              </span>
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {adminData?.attempts && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {t('exam.adminView.studentPerformance')}
              </h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-indigo-50 border-b font-medium text-indigo-800 grid grid-cols-4 gap-4">
                  <span>{t('exam.adminView.columns.student')}</span>
                  <span>{t('exam.adminView.columns.email')}</span>
                  <span>{t('exam.adminView.columns.score')}</span>
                  <span>{t('exam.adminView.columns.status')}</span>
                </div>
                {adminData.attempts.map(
                  (attempt: ExamAttempt, index: number) => (
                    <div
                      key={index}
                      className="p-4 border-b last:border-b-0 grid grid-cols-4 gap-4 hover:bg-indigo-50 transition-colors duration-200"
                      onClick={() => navigate(`/profile/${attempt.user._id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {attempt.user.name.charAt(0)}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium">
                          {attempt.user.name}
                        </p>
                      </div>
                      <p className="text-gray-600 self-center">
                        {attempt.user.email}
                      </p>
                      <div className="self-center">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                          {attempt.score}/10
                        </span>
                      </div>
                      <div className="self-center">
                        {attempt.score >= 7 ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {t('exam.adminView.status.passed')}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            {t('exam.adminView.status.failed')}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/**All the resourcesources */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {t('exam.adminView.resources')}
            </h2>

            <div className="space-y-4">
              {adminData?.exam.resources?.map((resource: string) => (
                <a
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  {resource}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-lg p-6 border border-indigo-500">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            <span className={difficultyColor}>
              {t(`exam.title.${difficulty}`)}
            </span>
          </h1>

          <div className="flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2">
            <AlertCircle className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span className="text-sm text-indigo-600 font-medium">
              {t('exam.scoreToAdvance')}
            </span>
          </div>
        </div>

        {/* Question section */}
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 transition-all duration-300 hover:shadow-lg border-indigo-400 bg-gradient-to-br from-white to-indigo-100"
            >
              <p className="text-lg font-medium mb-4">
                <span className="text-indigo-600 font-bold mr-2">
                  {t('exam.question')}
                  {index + 1}.
                </span>
                {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-200 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === optionIndex.toString()}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [index]: optionIndex.toString(),
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 hover:text-indigo-700 transition-colors duration-200">
                      {option}
                    </span>
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
              <span>{t('exam.submit')}</span>
              {Object.keys(answers).length === exam.questions.length && (
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
