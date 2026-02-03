import { apiClient } from '../../../core/api/client';

export const goalService = {
  getAll: async (estado) => {
    const params = estado ? { estado } : {};
    const response = await apiClient.get('/metas', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/metas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/metas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/metas/${id}`);
  }
};
