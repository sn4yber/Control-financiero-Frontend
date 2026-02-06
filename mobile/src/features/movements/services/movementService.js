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
    console.log('🔍 Fetching movements from API...');
    const response = await apiClient.get('/movimientos', {
      params: filters
    });
    console.log('✅ API Response:', response.data?.length || 0, 'movements');
    console.log('📦 Sample movement:', response.data?.[0]);
    return response.data;
  }
};
