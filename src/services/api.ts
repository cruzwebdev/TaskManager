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
  getAll: async () => {
    const { data } = await api.get('/tasks');
    return data;
  },
  create: async (task: any) => {
    const { data } = await api.post('/tasks', task);
    return data;
  },
  update: async (id: string, task: any) => {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;