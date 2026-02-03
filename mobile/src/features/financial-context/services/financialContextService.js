import { apiClient } from '../../../core/api/client';

export const financialContextService = {
  create: async (data) => {
    const response = await apiClient.post('/contextos-financieros', data);
    return response.data;
  },

  get: async () => {
    const response = await apiClient.get('/contextos-financieros');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/contextos-financieros/${id}`);
    return response.data;
  }
};
