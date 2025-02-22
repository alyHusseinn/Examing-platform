import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { auth } from '../lib/api';
import { useAuthStore } from '../store/auth';
import { useTranslation } from '../hooks/useTranslation';

export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await auth.register({ name, email, password, role: 'student' });
      localStorage.setItem('token', user.token);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">{t('auth.register.title')}</h1>
        <p className="text-gray-600 mt-2">{t('auth.register.subtitle')}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border-2 border-indigo-200">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="h-8 w-8 text-indigo-600" />
          <h2 className="text-2xl font-bold ml-2">{t('auth.register.createAccount')}</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('auth.register.fullName')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('auth.register.email')}
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
              {t('auth.register.password')}
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
            {t('auth.register.submit')}
          </button>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>{t('auth.register.features.courses')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>{t('auth.register.features.pace')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>{t('auth.register.features.community')}</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            {t('auth.register.haveAccount')}{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              {t('auth.register.signIn')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}