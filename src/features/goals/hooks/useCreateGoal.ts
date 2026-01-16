import { useState } from 'react';
import { goalService } from '../services/goalService';
import type { FinancialGoal } from '../../../core/types/domain';

export type CreateGoalDTO = Omit<FinancialGoal, 'id' | 'montoActual' | 'estado'>;

export const useCreateGoal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGoal = async (data: CreateGoalDTO) => {
    try {
      setLoading(true);
      setError(null);
      await goalService.create(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al crear la meta');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createGoal, loading, error };
};
