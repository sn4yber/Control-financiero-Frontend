import { useState } from 'react';
import { goalService } from '../services/goalService';

export const useUpdateGoal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateGoal = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await goalService.update(id, data);
      return result;
    } catch (err) {
      setError(err.message || 'Error al actualizar la meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateGoal, loading, error };
};
