import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { Book, Award, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const subjects = [
    { id: '1', name: 'Mathematics', progress: 75 },
    { id: '2', name: 'Physics', progress: 60 },
    { id: '3', name: 'Chemistry', progress: 45 },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey and track your progress across subjects.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <Book className="h-8 w-8 text-indigo-600" />
              <span className="text-sm font-medium text-gray-500">
                Progress: {subject.progress}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {subject.name}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${subject.progress}%` }}
              ></div>
            </div>
            <Link
              to={`/exam/${subject.id}`}
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Next Exam
            </Link>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Achievements
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span>Completed Mathematics Level 2</span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Perfect Score in Physics Quiz</span>
              <span className="text-sm text-gray-500">1 week ago</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Performance Overview
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Average Score</span>
                <span className="text-indigo-600 font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Completion Rate</span>
                <span className="text-indigo-600 font-medium">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;