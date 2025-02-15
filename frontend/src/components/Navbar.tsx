import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Coins } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-gray-900">Adaptive Learning</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
            {user.role === 'student' && (
              <div className="flex items-center space-x-2 bg-indigo-100 rounded-full px-4 py-1.5 hover:bg-indigo-200 transition-colors">
                <span className="font-medium text-indigo-700">
                  {user.points ? `${user.points} Points!` : '0 Points'}
                </span>
                <Coins className="h-5 w-5 text-indigo-600 animate-bounce" />
              </div>
            )}
            <span className="text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}