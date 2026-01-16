import { apiClient } from '../../../core/api/client';
import type { Category, CategoryType } from '../../../core/types/domain';

export const categoryService = {
  getAll: async (tipo?: CategoryType): Promise<Category[]> => {
    const params = tipo ? { tipo } : {};
    const response = await apiClient.get<Category[]>('/categorias', { params });
    return response.data;
  },

  create: async (data: Omit<Category, 'id' | 'usuarioId'>): Promise<Category> => {
    const response = await apiClient.post<Category>('/categorias', data);
    return response.data;
  }
};
