import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }
};

export const exams = {
  getAll: async () => {
    const response = await api.get('/exams');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },
  submitAttempt: async (examId: string, answers: number[]) => {
    const response = await api.post(`/exams/${examId}/attempt`, { answers });
    return response.data;
  }
};

export const subjects = {
  getAll: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  }
};

export default api;