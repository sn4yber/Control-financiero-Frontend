import { useState, useEffect, useCallback } from 'react';
import { goalService } from '../services/goalService';
import type { FinancialGoal, GoalStatus } from '../../../core/types/domain';

export const useGoals = (userId?: number, estado: GoalStatus = 'ACTIVE') => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await goalService.getAllByUserId(userId, estado);
      setGoals(data);
    } catch (err) {
      console.warn('Error fetching goals:', err);
      // Don't set global error to avoid blocking UI on minor fetch errors
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [userId, estado]);

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [fetchGoals]);

  return { goals, loading, error, refetch: fetchGoals };
};
