import { useState } from 'react';
import { goalService } from '../services/goalService';
import type { FinancialGoal } from '../../../core/types/domain';

export const useUpdateGoal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGoal = async (id: number, data: Partial<FinancialGoal>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGoal = await goalService.update(id, data);
      return updatedGoal;
    } catch (err) {
      setError('Error al actualizar la meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateGoal, loading, error };
};
