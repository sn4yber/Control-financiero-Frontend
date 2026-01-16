import { useState, useEffect, useCallback } from 'react';
import { movementService } from '../services/movementService';
import type { FinancialMovement, MovementType } from '../../../core/types/domain';

interface UseMovementsProps {
  userId?: number;
  filters?: {
    tipo?: MovementType;
    fechaInicio?: string;
    fechaFin?: string;
    categoriaId?: number;
  };
}

export const useMovements = ({ userId, filters }: UseMovementsProps) => {
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serializamos filters para usarlos como dependencia estable
  const filtersKey = JSON.stringify(filters ?? {});

  const fetchMovements = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Parseamos la key para no depender de la referencia del objeto filters
      const currentFilters = JSON.parse(filtersKey);
      
      const data = await movementService.getAllByUserId(userId, currentFilters);
      setMovements(data);
    } catch (err) {
      setError('Error al cargar movimientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
    // Eliminamos 'filters' de las dependencias para evitar loops infinitos por cambios de referencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filtersKey]);

  useEffect(() => {
    if (userId) {
      fetchMovements();
    }
  }, [fetchMovements, userId]);

  return { movements, loading, error, refetch: fetchMovements };
};
