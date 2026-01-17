import { useState, useEffect, useCallback } from 'react';
import { movementService } from '../services/movementService';
import { categoryService } from '../../categories/services/categoryService';
import { incomeSourceService } from '../../income-sources/services/incomeSourceService';
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
      
      // Patch: Enriquecer datos si el backend no devuelve los nombres unidos
      const missingCategoryNames = data.some(m => m.categoriaId && !m.categoriaNombre);
      const missingSourceNames = data.some(m => m.fuenteIngresoId && !m.fuenteIngresoNombre);
      
      if (missingCategoryNames || missingSourceNames) {
        try {
          // Cargar metadatos necesarios
          const [categories, sources] = await Promise.all([
            missingCategoryNames ? categoryService.getAll().catch(() => []) : Promise.resolve([]),
            missingSourceNames ? incomeSourceService.getAll().catch(() => []) : Promise.resolve([])
          ]);
          
          const enrichedData = data.map(m => {
            const newItem = { ...m };
            
            if (m.categoriaId && !m.categoriaNombre) {
              const cat = categories.find((c: any) => c.id === m.categoriaId);
              if (cat) newItem.categoriaNombre = cat.nombre;
            }
            
            if (m.fuenteIngresoId && !m.fuenteIngresoNombre) {
              const src = sources.find((s: any) => s.id === m.fuenteIngresoId);
              if (src) newItem.fuenteIngresoNombre = src.nombre;
            }
            
            return newItem;
          });
          
          setMovements(enrichedData);
          return;
        } catch (enrichErr) {
          console.warn('Error completando nombres de categorías/fuentes:', enrichErr);
        }
      }

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
