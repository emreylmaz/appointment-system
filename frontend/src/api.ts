import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Appointment {
  id: number;
  userId: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export const auth = {
  login: (email: string, password: string) => 
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) => 
    api.post<{ token: string; user: User }>('/auth/register', { email, password, name }),
  me: () => api.get<User>('/auth/me'),
};

export const appointments = {
  list: () => api.get<Appointment[]>('/appointments'),
  create: (data: Partial<Appointment>) => api.post<Appointment>('/appointments', data),
  update: (id: number, data: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};

export const slots = {
  available: (date: string) => api.get<string[]>('/slots', { params: { date } }),
};

export default api;
