import { apiFetch } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  university?: string;
  college?: string;
  studentId?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    university?: string;
    college?: string;
    studentId?: string;
    token: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async (): Promise<any> => {
  return apiFetch('/auth/me');
};
