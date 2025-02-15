import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (data: { name: string; email: string; password: string; role: string }) =>
    (await api.post('/auth/register', data)).data,
  login: async (data: { email: string; password: string }) =>
    (await api.post('/auth/login', data)).data,
};

export const subjects = {
  getAll: async () => (await api.get('/subjects')).data,
  getById: async (id: string) => (await api.get(`/subjects/${id}`)).data,
  create: async (data: { name: string; description: string }) =>
    (await api.post('/subjects', data)).data,
};

export const exams = {
  getById: async (id: string, difficulty?: string) => (await api.get(`/exams/${id}?difficulty=${difficulty}`)).data,
  submit: async (id: string, difficulty: string, data: { answers: Record<string, string> }) =>
    (await api.post(`/exams/${id}?difficulty=${difficulty}`, data)).data,
};

export const chatbot = {
  ask: async (subject: string, question: string) => (await api.post('/chatbot', { subject, question })).data,
};

export default api;