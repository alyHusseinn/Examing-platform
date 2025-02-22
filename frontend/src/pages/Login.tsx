import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { auth } from '../lib/api';
import { useAuthStore } from '../store/auth';
import { useTranslation } from '../hooks/useTranslation';

export default function Login() {
  const { t } = useTranslation();
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
      console.log(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow-md border-2 border-indigo-200">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center">
            <LogIn className="h-8 w-8 text-indigo-600 animate-bounce" />
            <h1 className="text-3xl font-bold ml-2 text-indigo-600">
              {t('auth.login.title')}
            </h1>
          </div>
          <p className="text-gray-600 mt-4 text-center">
            {t('auth.login.subtitle')}
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
              {t('auth.login.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('auth.login.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {t('auth.login.submit')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">{t('auth.login.newUser')}</p>
          <Link 
            to="/register" 
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            {t('auth.login.joinCommunity')}
          </Link>
        </div>
      </div>
    </div>
  );
}