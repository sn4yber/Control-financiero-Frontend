import { useState } from 'react';
import { movementService } from '../services/movementService';

export const useDeleteMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMovement = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await movementService.delete(id);
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar movimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteMovement, loading, error };
};
