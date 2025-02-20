import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SubjectList from './pages/SubjectList';
import SubjectDetail from './pages/SubjectDetail';
import Exam from './pages/Exam';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ExamResults from './pages/ExamResults';
import { initializeAuth } from './lib/api';
const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin' ? element : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/subjects" element={<PrivateRoute element={<SubjectList />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/subjects/:id" element={<PrivateRoute element={<SubjectDetail />} />} />
              <Route path="/exams/:id" element={<PrivateRoute element={<Exam />} />} />
              <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
              <Route path="/profile/:id?" element={<PrivateRoute element={<Profile />} />} />
              <Route path="/exam-results" element={<PrivateRoute element={<ExamResults />} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;