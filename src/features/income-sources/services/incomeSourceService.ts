import { apiClient } from '../../../core/api/client';
import type { IncomeSource } from '../../../core/types/domain';

export const incomeSourceService = {
  getAllByUserId: async (userId: number): Promise<IncomeSource[]> => {
    const response = await apiClient.get<IncomeSource[]>(`/fuentes-ingresos/usuario/${userId}`);
    return response.data;
  }
};
