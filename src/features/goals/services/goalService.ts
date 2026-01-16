import { apiClient } from '../../../core/api/client';
import type { FinancialGoal, GoalStatus } from '../../../core/types/domain';

export const goalService = {
  getAllByUserId: async (userId: number, estado?: GoalStatus): Promise<FinancialGoal[]> => {
    const params = estado ? { estado } : {};
    const response = await apiClient.get<FinancialGoal[]>(`/metas/usuario/${userId}`, { params });
    return response.data;
  },

  create: async (data:  Omit<FinancialGoal, 'id' | 'montoActual' | 'estado'>): Promise<FinancialGoal> => {
    const response = await apiClient.post<FinancialGoal>('/metas', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/metas/${id}`);
  }
};
