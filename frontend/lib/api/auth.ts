import { apiClient } from './client';
import { User, CreateUserRequest } from '../types';

export const authApi = {
  register: async (data: CreateUserRequest): Promise<User> => {
    return apiClient.post<User>('/auth/register', data);
  },

  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/auth/users');
  },

  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/auth/users/${id}`);
  },
};

