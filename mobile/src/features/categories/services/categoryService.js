import { apiClient } from '../../../core/api/client';

export const categoryService = {
  getAll: async (tipo) => {
    const params = tipo ? { tipo } : {};
    const response = await apiClient.get('/categorias', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/categorias', data);
    return response.data;
  }
};
