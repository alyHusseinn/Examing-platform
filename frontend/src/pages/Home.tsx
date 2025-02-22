import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Trophy, Users, ArrowRight, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/auth';
// import studentsImage1 from '../assets/images/students1.jpg';
import studentsImage2 from '../assets/images/students2.jpg';
import studentsImage3 from '../assets/images/students3.jpg';
import learningImage from '../assets/images/students3.jpg';
import communityImage from '../assets/images/students4.jpg';
import { motion } from 'framer-motion';
import studentImage from '../assets/images/student.jpg';
import { useTranslation } from '../hooks/useTranslation';

const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <Icon className="h-8 w-8 text-indigo-600 mb-4" />
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// New component for the hero section
const HeroSection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-gray-600 uppercase tracking-wider text-sm">{t('home.adaptiveLearning')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t('home.learnAtYourPace')}
          </h1>
        </div>
        
        <p className="text-gray-600 text-lg">
          {t('home.experiencePersonalized')}
        </p>

        <div className="flex items-center space-x-4">
          <Link
            to={isAuthenticated ? "/subjects" : "/register"}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            {t('home.startLearning')}
          </Link>
          <Link
            to="/subjects"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="bg-pink-100 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-pink-500" />
            </div>
            <span>{t('home.browseSubjects')}</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-indigo-600">500+</p>
            <p className="text-sm text-gray-600">{t('home.practiceQuestions')}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-indigo-600">15+</p>
            <p className="text-sm text-gray-600">{t('home.subjects')}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-indigo-600">24/7</p>
            <p className="text-sm text-gray-600">{t('home.aiSupport')}</p>
          </div>
        </div>
      </div>

      {/* Right Content - Adjust image container size */}
      <motion.div 
        className="relative h-full flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main circular background with animated border */}
        <div className="relative w-[80%] aspect-square max-w-xl">
          {/* Outer spinning container */}
          <div className="absolute -inset-4 rounded-full border-2 border-indigo-500/30 animate-[spin_8s_linear_infinite]" />
          <div className="absolute -inset-8 rounded-full border-2 border-dashed border-indigo-400/20 animate-[spin_12s_linear_infinite_reverse]" />
          
          {/* Background and image */}
          <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-50" />
          <motion.img
            src={studentImage}
            alt="Student learning"
            className="relative z-10 w-full h-full object-cover rounded-full object-top"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Floating elements - added more items */}
        <motion.div
          className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-lg z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-medium">{t('home.floatingElements.aiPowered')}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-0 bg-white p-4 rounded-lg shadow-lg z-20"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-emerald-500" />
            <span className="text-sm font-medium">{t('home.floatingElements.smartCurriculum')}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-10 bg-white p-4 rounded-lg shadow-lg z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-sm font-medium">{t('home.floatingElements.trackProgress')}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-0 bg-white p-4 rounded-lg shadow-lg z-20"
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 2.3, repeat: Infinity, delay: 0.7 }}
        >
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-purple-500" />
            <span className="text-sm font-medium">{t('home.floatingElements.communitySupport')}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// New component for the features section
const FeaturesSection = () => {
  const { t } = useTranslation();
  
  return (
    <div className="py-24 min-h-[calc(100vh-8rem)] flex items-center">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.powerfulFeatures')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('home.experienceLearning')}</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {[
            {
              icon: Brain,
              title: t('home.features.aiPowered.title'),
              description: t('home.features.aiPowered.description')
            },
            {
              icon: Trophy,
              title: t('home.features.trackProgress.title'),
              description: t('home.features.trackProgress.description')
            },
            {
              icon: Users,
              title: t('home.features.community.title'),
              description: t('home.features.community.description')
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>

        {/* Updated Image Grid with animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:col-span-8 relative group">
            <img
              src={learningImage}
              alt="Learning Experience"
              className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-bold text-white mb-2">Interactive Learning</h3>
                <p className="text-white/90">Engage with dynamic content that makes learning enjoyable and effective.</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 space-y-8">
            <div className="relative group">
              <img
                src={studentsImage2}
                alt="Student Success"
                className="w-full h-[235px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-2">Student Success</h3>
                  <p className="text-white/90">Join thousands of successful learners.</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <img
                src={studentsImage3}
                alt="Global Community"
                className="w-full h-[235px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-2">Global Community</h3>
                  <p className="text-white/90">Connect with learners worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// New component for testimonials
const TestimonialsSection = () => {
  const { t } = useTranslation();
  
  return (
    <div className="py-24 min-h-[calc(100vh-8rem)] flex items-center bg-gradient-to-b from-white to-indigo-50">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('home.testimonials.subtitle')}</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {['student1', 'student2', 'student3'].map((studentKey, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <p className="text-gray-600 italic mb-4">"{t(`home.testimonials.students.${studentKey}.content`)}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {t(`home.testimonials.students.${studentKey}.name`)[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t(`home.testimonials.students.${studentKey}.name`)}</p>
                  <p className="text-sm text-gray-500">{t(`home.testimonials.students.${studentKey}.role`)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// New component for CTA
const CTASection = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative py-24 min-h-[calc(100vh-8rem)] flex items-center overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img 
          src={communityImage} 
          alt="Community" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-purple-600/95" />
      </motion.div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          {!isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>{t('home.cta.button')}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-16">
        <HeroSection isAuthenticated={isAuthenticated} />
      </div>
      
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection isAuthenticated={isAuthenticated} />

      {/* Regular style tag */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
} 