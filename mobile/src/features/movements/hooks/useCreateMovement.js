import { useState } from 'react';
import { movementService } from '../services/movementService';

export const useCreateMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMovement = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await movementService.create(data);
      return response;
    } catch (err) {
      setError(err.message || 'Error al crear movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createMovement, loading, error };
};
