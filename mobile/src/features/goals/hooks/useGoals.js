import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';

export const useGoals = (estado) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await goalService.getAll(estado);
        setGoals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [estado]);

  return { goals, loading, error };
};
