import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { auth } from '../lib/api';
import { useAuthStore } from '../store/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await auth.login({ email, password });
      localStorage.setItem('token', user.token);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center">
            <LogIn className="h-8 w-8 text-indigo-600 animate-bounce" />
            <h1 className="text-3xl font-bold ml-2 text-indigo-600">Welcome Back!</h1>
          </div>
          <p className="text-gray-600 mt-4 text-center">
            Ready to continue your learning journey? 🚀<br />
            Sign in to access your personalized learning experience!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105"
          >
            Start Learning Now
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">New to our platform?</p>
          <Link 
            to="/register" 
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Join our learning community today! ✨
          </Link>
        </div>
      </div>
    </div>
  );
}