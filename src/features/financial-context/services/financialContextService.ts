import { apiClient } from '../../../core/api/client';
import type { FinancialContext } from '../../../core/types/domain';

export const financialContextService = {
  create: async (data: Omit<FinancialContext, 'id' | 'codigoMoneda'>): Promise<FinancialContext> => {
    const response = await apiClient.post<FinancialContext>('/contextos-financieros', data);
    return response.data;
  },

  get: async (): Promise<FinancialContext> => {
    // Assuming backend also removed /usuario/{id} for this one
    // New endpoint: GET /api/contextos-financieros (for current user)
    const response = await apiClient.get<FinancialContext>('/contextos-financieros');
    return response.data;
  },

  getById: async (id: number): Promise<FinancialContext> => {
    const response = await apiClient.get<FinancialContext>(`/contextos-financieros/${id}`);
    return response.data;
  }
};
