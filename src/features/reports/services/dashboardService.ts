import { apiClient } from '../../../core/api/client';
import type { FinancialGoal } from '../../../core/types/domain';

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
  savings: number;
  metas: FinancialGoal[];
}

export interface CategoryExpense {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  color?: string; // Backend might not send this, but UI needs it
}

export const dashboardService = {
  getSummary: async (startDate?: string, endDate?: string): Promise<DashboardSummary> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary', { params });
    return response.data;
  },

  getExpensesByCategory: async (startDate?: string, endDate?: string): Promise<CategoryExpense[]> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<CategoryExpense[]>('/dashboard/expenses-by-category', { params });
    return response.data;
  }
};
