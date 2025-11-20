import { apiClient } from './client';
import { User, CreateUserRequest } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  register: async (data: CreateUserRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data, {}, true);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data, {}, true);
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    return apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, {}, true);
  },

  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/auth/users');
  },

  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/auth/users/${id}`);
  },
};

