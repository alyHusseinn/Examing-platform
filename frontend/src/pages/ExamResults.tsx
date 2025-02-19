import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, BookOpen, Youtube, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

interface LocationState {
  score: number;
  youtubeResources?: string[];
  webResources?: string[];
}

export default function ExamResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, youtubeResources = [], webResources = [] } = location.state as LocationState;
  const passed = score >= 7;

  // Function to extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

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
          {passed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
        </h1>

        <div className="text-6xl font-bold mb-4 text-indigo-600">
          {score}/10
        </div>

        <p className="text-gray-600 text-lg mb-6">
          {passed
            ? "Great job! You've mastered this level!"
            : "Don't worry! Here are some resources to help you improve:"}
        </p>

        <Button
          onClick={() => navigate(-1)}
          variant="primary"
          className="animate-bounce"
        >
          Continue Learning
        </Button>
      </motion.div>

      {/* Resources Section - Show only if failed */}
      {!passed && (youtubeResources.length > 0 || webResources.length > 0) && (
        <div className="space-y-6">
          {/* YouTube Resources */}
          {youtubeResources.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Youtube className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-bold">Video Resources</h2>
              </div>
              <div className="space-y-6">
                {youtubeResources.map((url, index) => {
                  const videoId = getYoutubeVideoId(url);
                  return videoId ? (
                    <div key={index} className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`YouTube video ${index + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg shadow-md w-full h-[315px]"
                      />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Web Resources */}
          {webResources.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <LinkIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold">Additional Resources</h2>
              </div>
              <div className="space-y-3">
                {webResources.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-4 w-4 text-indigo-600" />
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
