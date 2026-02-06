import { useState } from 'react';
import { goalService } from '../services/goalService';

export const useCreateGoal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createGoal = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await goalService.create(data);
      return result;
    } catch (err) {
      setError(err.message || 'Error al crear la meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createGoal, loading, error };
};
