import React from 'react';
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
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute element={<SubjectList />} />} />
              <Route path="/subjects/:id" element={<PrivateRoute element={<SubjectDetail />} />} />
              <Route path="/exams/:id" element={<PrivateRoute element={<Exam />} />} />
              <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;