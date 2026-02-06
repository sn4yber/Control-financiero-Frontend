import { useState, useEffect, useCallback } from 'react';
import { movementService } from '../services/movementService';

export const useMovements = (filters = {}) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovements = useCallback(async () => {
    try {
      console.log('📥 Fetching movements...');
      setLoading(true);
      const data = await movementService.getAll(filters);
      console.log('✅ Movements fetched:', data.length);
      setMovements(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching movements:', err);
      setError(err.message);
      setMovements([]); // Asegurar que movements sea un array vacío en error
    } finally {
      setLoading(false);
      console.log('🏁 Movements loading finished');
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return { movements, loading, error, refetch: fetchMovements };
};
