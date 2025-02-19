import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Trophy, Users, Rocket, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-100 rounded-lg">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20 space-y-6 animate-fade-in">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
          <BookOpen className="h-16 w-16 text-indigo-600 relative" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Adaptive Learning
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Embark on a personalized learning journey that adapts to your pace and style.
          Master new skills with our innovative AI-powered platform.
        </p>
        <div className="flex justify-center space-x-4">
          {!isAuthenticated && (
            <>
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-bounce"
              >
                Start Learning Now
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
              >
                Sign In
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link
              to="/subjects"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
            >
              <span>Go to Subjects</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={Brain}
              title="Adaptive Learning"
              description="Our AI-powered system adjusts to your learning pace and style, ensuring optimal progress."
            />
            <FeatureCard
              icon={Trophy}
              title="Achievement System"
              description="Earn points and unlock new levels as you master different subjects and concepts."
            />
            <FeatureCard
              icon={Users}
              title="Community Learning"
              description="Join a vibrant community of learners and share your knowledge and experiences."
            />
            <FeatureCard
              icon={Rocket}
              title="Instant Progress"
              description="Get immediate feedback and track your progress with detailed analytics."
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                content: "The adaptive learning system helped me master complex programming concepts at my own pace."
              },
              {
                name: "Michael Chen",
                role: "Data Science Enthusiast",
                content: "The interactive exercises and immediate feedback made learning statistics much more engaging."
              },
              {
                name: "Emily Williams",
                role: "Mathematics Major",
                content: "I love how the platform adjusts to my learning style and helps me focus on areas where I need improvement."
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: 'fade-slide-up 0.5s ease forwards'
                }}
              >
                <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of students who are already experiencing the future of education.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 