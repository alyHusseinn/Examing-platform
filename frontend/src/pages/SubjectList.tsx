import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Book, ArrowRight } from 'lucide-react';
import { subjects } from '../lib/api';
import type { Subject } from '../types';

const SUBJECT_THEMES = [
  { 
    bg: 'bg-blue-50/50', 
    border: 'border-blue-200',
    hover: 'hover:border-blue-400 hover:bg-blue-50',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
  },
  { 
    bg: 'bg-rose-50/50', 
    border: 'border-rose-200',
    hover: 'hover:border-rose-400 hover:bg-rose-50',
    text: 'text-rose-700',
    iconBg: 'bg-rose-100',
  },
  { 
    bg: 'bg-emerald-50/50', 
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-400 hover:bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  { 
    bg: 'bg-purple-50/50', 
    border: 'border-purple-200',
    hover: 'hover:border-purple-400 hover:bg-purple-50',
    text: 'text-purple-700',
    iconBg: 'bg-purple-100',
  },
  { 
    bg: 'bg-orange-50/50', 
    border: 'border-orange-200',
    hover: 'hover:border-orange-400 hover:bg-orange-50',
    text: 'text-orange-700',
    iconBg: 'bg-orange-100',
  },
  { 
    bg: 'bg-red-50/50', 
    border: 'border-red-200',
    hover: 'hover:border-red-400 hover:bg-red-50',
    text: 'text-red-700',
    iconBg: 'bg-red-100',
  },
] as const;

export default function SubjectList() {
  const { data: subjectList, isLoading, error } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: subjects.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load subjects. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Let's Start Learning! 🚀
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectList?.map((subject, index) => {
          const theme = SUBJECT_THEMES[Math.floor(Math.random() * SUBJECT_THEMES.length)];
          
          return (
            <Link
              key={subject._id}
              to={`/subjects/${subject._id}`}
              className="block group"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fade-slide-up 0.5s ease forwards'
              }}
            >
              <div className={`
                relative overflow-hidden rounded-xl border-2 ${theme.border} ${theme.bg} ${theme.hover}
                transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
              `}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`
                      p-3 rounded-xl ${theme.iconBg} 
                      transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
                    `}>
                      <Book className={`h-6 w-6 ${theme.text}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className={`text-xl font-semibold ${theme.text}`}>
                        {subject.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-2">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                  <div className={`
                    mt-4 flex items-center justify-end
                    text-sm font-medium ${theme.text}
                  `}>
                    Explore Course 
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}