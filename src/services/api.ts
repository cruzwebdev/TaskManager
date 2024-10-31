import axios from 'axios';
import type { Task, CreateTaskInput } from '../types/task';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  register: async (email: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const tasks = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get('/tasks');
    return data;
  },
  create: async (task: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post('/tasks', task);
    return data;
  },
  update: async (id: string, task: Partial<Task>): Promise<Task> => {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};