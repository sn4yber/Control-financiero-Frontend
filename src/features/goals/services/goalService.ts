import { apiClient } from '../../../core/api/client';
import type { FinancialGoal, GoalStatus } from '../../../core/types/domain';

export const goalService = {
  getAll: async (estado?: GoalStatus): Promise<FinancialGoal[]> => {
    const params = estado ? { estado } : {};
    const response = await apiClient.get<FinancialGoal[]>('/metas', { params });
    return response.data;
  },

  create: async (data: Omit<FinancialGoal, 'id' | 'montoActual' | 'estado' | 'usuarioId'>): Promise<FinancialGoal> => {
    const response = await apiClient.post<FinancialGoal>('/metas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<FinancialGoal>): Promise<FinancialGoal> => {
    const response = await apiClient.put<FinancialGoal>(`/metas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/metas/${id}`);
  }
};
