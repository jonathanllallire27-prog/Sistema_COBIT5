import api from './api';
import { User, AuthResponse } from '@/types';
import { LoginFormData, RegisterFormData } from '@/types/auth.types';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<{ success: boolean; data: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};