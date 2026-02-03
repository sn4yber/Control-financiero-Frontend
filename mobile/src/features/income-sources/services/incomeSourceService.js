import { apiClient } from '../../../core/api/client';

export const incomeSourceService = {
  getAll: async () => {
    const response = await apiClient.get('/fuentes-ingreso');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/fuentes-ingreso', data);
    return response.data;
  }
};
