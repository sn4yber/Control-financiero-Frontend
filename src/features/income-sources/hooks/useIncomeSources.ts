import { useState, useEffect } from 'react';
import { incomeSourceService } from '../services/incomeSourceService';
import type { IncomeSource } from '../../../core/types/domain';

export const useIncomeSources = (userId?: number) => {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSources = async () => {
      try {
        setLoading(true);
        const data = await incomeSourceService.getAllByUserId(userId);
        setSources(data);
      } catch (err) {
        // Ignoramos el error 500 para no bloquear la UI, asumiendo lista vacía
        console.warn('Error fetching income sources:', err);
        setSources([]); 
        setError('No se pudieron cargar las fuentes de ingreso');
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [userId]);

  return { sources, loading, error };
};
