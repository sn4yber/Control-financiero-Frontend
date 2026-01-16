import { useState, useEffect, useCallback } from 'react';
import { movementService } from '../services/movementService';
import type { FinancialMovement, MovementType } from '../../../core/types/domain';

interface UseMovementsProps {
  filters?: {
    tipo?: MovementType;
    fechaInicio?: string;
    fechaFin?: string;
    categoriaId?: number;
  };
}

export const useMovements = ({ filters }: UseMovementsProps = {}) => {
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serializamos filters para usarlos como dependencia estable
  const filtersKey = JSON.stringify(filters ?? {});

  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Parseamos la key para no depender de la referencia del objeto filters
      const currentFilters = JSON.parse(filtersKey);
      
      const data = await movementService.getAll(currentFilters);
      setMovements(data);
    } catch (err) {
      setError('Error al cargar movimientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return { movements, loading, error, refetch: fetchMovements };
};
