import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LocationState {
  score: number;
  resources: string[];
}

export default function ExamResults() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // when the page loads, scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { score, resources = [] } = location.state as LocationState;
  const passed = score >= 7;

  console.log(resources);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Score Section */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          {passed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
            </motion.div>
          ) : (
            <BookOpen className="h-16 w-16 text-indigo-600 mx-auto" />
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {passed ? t('examResults.congratulations') : t('examResults.keepLearning')}
        </h1>

        <div className="text-6xl font-bold mb-4 text-indigo-600">
          {score}/10
        </div>

        <p className="text-gray-600 text-lg mb-6">
          {passed ? t('examResults.greatJob') : t('examResults.dontWorry')}
        </p>

        <Button
          onClick={() => navigate(-2)}
          variant="primary"
          className="animate-bounce"
        >
          {t('examResults.continueLearning')}
        </Button>
      </motion.div>

      {/* Resources Section - Show only if failed */}
      {!passed && resources.length > 0 && (
        <div className="space-y-6">
          {/* Courses */}
          {resources.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold">{t('examResults.recommendedResources')}</h2>
              </div>
              <div className="space-y-3">
                {resources.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      <span className="text-indigo-600 hover:underline">{url}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
