import { apiRequest } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'university_admin' | 'college_admin' | 'student';
  collegeId?: string;
  studentInfo?: any;
  facultyInfo?: any;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const data = await apiRequest('/auth/login', 'POST', credentials);
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data.data;
  },

  register: async (userData: RegisterData) => {
    const data = await apiRequest('/auth/register', 'POST', userData);
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data.data;
  },

  getCurrentUser: async () => {
    const data = await apiRequest('/auth/me', 'GET');
    return data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
