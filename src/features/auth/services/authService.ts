import { apiClient } from '../../../core/api/client';
import type { User } from '../../../core/types/domain';

interface CreateUserDTO {
  username: string;
  email: string;
  password?: string; 
  fullName: string;
}

export const authService = {
  // Registro: POST /api/usuarios
  register: async (data: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post<User>('/usuarios', {
      ...data,
      password: data.password || '123456' 
    });
    return response.data;
  },

  // Obtener por ID: GET /api/usuarios/{id}
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/usuarios/${id}`);
    return response.data;
  }
};
