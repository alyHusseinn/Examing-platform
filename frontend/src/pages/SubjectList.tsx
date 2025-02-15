import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Book, ArrowRight } from 'lucide-react';
import { subjects } from '../lib/api';
import type { Subject } from '../types';

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
        Let's Start Learning! 🚀
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectList?.map((subject, index) => (
          <Link
            key={subject._id}
            to={`/subjects/${subject._id}`}
            className="block group"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fade-slide-up 0.5s ease forwards'
            }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-102">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300 group-hover:rotate-6">
                    <Book className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {subject.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-indigo-500 transition-colors duration-300">
                      {subject.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}