import { useAuthStore } from '../store/auth';
import { motion } from 'framer-motion';
import { Trophy, BookOpen, Clock, Award, ChevronRight, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { subjects, userStats } from '../lib/api';
import { Link, useParams } from 'react-router-dom';
import { Subject } from '../types';
import { useTranslation } from '../hooks/useTranslation';
  
export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  
  const { data: subjectList } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjects.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ['userStats'],
    queryFn: user?.role === 'admin' ? () => userStats.getStatsById(id!) : userStats.getStats,
  });

  const calculateRank = (points: number) => {
    if (points >= 1000) return 'Master';
    if (points >= 500) return 'Advanced';
    if (points >= 200) return 'Intermediate';
    return 'Beginner';
  };

  console.log(stats);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full">
            <span className="text-2xl text-white">{stats?.user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stats?.user?.name}</h1>
            <p className="text-gray-600">{stats?.user?.email}</p>
          </div>
          {user?.role === 'admin' && (
            <motion.div
              className="ml-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-full">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-indigo-600" />
                  <span className="text-lg font-semibold text-indigo-600">
                    {stats?.user?.points || 0} {t('common.points')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-medium">{t('profile.stats.subjectsProgress')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.subjectsInProgress || 0}</p>
          <p className="text-sm text-gray-600 mt-1">{t('profile.stats.inProgress')}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2 text-purple-600 mb-2">
            <Target className="h-5 w-5" />
            <h3 className="font-medium">{t('profile.stats.examSuccess')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.passedExams || 0}</p>
          <p className="text-sm text-gray-600 mt-1">{t('profile.stats.examsPassed')}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2 text-emerald-600 mb-2">
            <Award className="h-5 w-5" />
            <h3 className="font-medium">{t('profile.stats.rank')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{calculateRank(user?.points || 0)}</p>
          <p className="text-sm text-gray-600 mt-1">
            {t('profile.stats.level')} {stats?.highestLevel || 0}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2 text-rose-600 mb-2">
            <Clock className="h-5 w-5" />
            <h3 className="font-medium">{t('profile.stats.studyTime')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.studyHours || 0}h</p>
          <p className="text-sm text-gray-600 mt-1">{t('profile.stats.totalHours')}</p>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('profile.performance.overview')}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${(stats?.averageScore || 0) * 10}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">{t('profile.performance.averageScore')}</span>
              <span className="font-medium text-indigo-600">
                {((stats?.averageScore || 0) * 10).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('profile.recentActivity.title')}
        </h2>
        <div className="space-y-4">
          {subjectList?.map((subject: Subject) => (
            <Link
              key={subject._id}
              to={`/subjects/${subject._id}`}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{t('profile.recentActivity.continueLeaning')}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 