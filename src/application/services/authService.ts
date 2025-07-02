import apiClient from '@/infrastructure/api/apiClient';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/domain/entities/User';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  // 前端清除 token 即可
  return Promise.resolve();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};