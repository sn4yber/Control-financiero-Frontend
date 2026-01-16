import { useState } from 'react';
import { movementService } from '../services/movementService';
import type { CreateMovementDTO } from '../services/movementService';

export const useCreateMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMovement = async (data: CreateMovementDTO) => {
    try {
      setLoading(true);
      setError(null);
      await movementService.create(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al crear el movimiento');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createMovement, loading, error };
};
