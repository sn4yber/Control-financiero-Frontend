import { useState, useEffect } from 'react';
import { movementService } from '../services/movementService';

export const useMovements = (filters = {}) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const data = await movementService.getAll(filters);
        setMovements(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [JSON.stringify(filters)]);

  return { movements, loading, error };
};
