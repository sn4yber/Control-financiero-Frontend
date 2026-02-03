import { apiClient } from '../../../core/api/client';

export const movementService = {
  create: async (data) => {
    const response = await apiClient.post('/movimientos', data);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/movimientos/${id}`);
  },

  getAll: async (filters = {}) => {
    const response = await apiClient.get('/movimientos', {
      params: filters
    });
    return response.data;
  }
};
