import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { Menu, X, BookOpen, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Left navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/subjects"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Subjects & Exams!
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Center logo and brand */}
          <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                Adaptive Learning
              </span>
            </Link>
          </div>

          {/* Right navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>

                  {user?.role === "student" && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={user?.points}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        ✨ {user?.points || 0} pts
                      </motion.span>
                    </motion.div>
                  </AnimatePresence>
                  )}
                </button>
                <div className="absolute right-0 w-48 mt-0 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  {user?.role != "admin" && (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      My Profile
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/subjects"
                className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              >
                Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
