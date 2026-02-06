import { useState } from 'react';
import { goalService } from '../services/goalService';

export const useDeleteGoal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteGoal = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await goalService.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGoal, loading, error };
};
