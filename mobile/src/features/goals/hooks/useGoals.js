import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';

export const useGoals = (estado) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      console.log('🎯 Fetching goals...');
      setLoading(true);
      const data = await goalService.getAll(estado);
      console.log('✅ Goals fetched:', data.length);
      setGoals(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching goals:', err);
      setError(err.message);
      setGoals([]); // Asegurar que goals sea un array vacío en error
    } finally {
      setLoading(false);
      console.log('🏁 Goals loading finished');
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [estado]);

  return { goals, loading, error, refetch: fetchGoals };
};
