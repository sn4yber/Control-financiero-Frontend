import { apiClient } from '../../../core/api/client';
import type { IncomeSource } from '../../../core/types/domain';

export const incomeSourceService = {
  getAll: async (): Promise<IncomeSource[]> => {
    const response = await apiClient.get<IncomeSource[]>('/fuentes-ingresos');
    return response.data;
  },

  create: async (data: Omit<IncomeSource, 'id' | 'usuarioId'>): Promise<IncomeSource> => {
    const response = await apiClient.post<IncomeSource>('/fuentes-ingresos', data);
    return response.data;
  }
};
