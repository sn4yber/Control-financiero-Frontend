import { useState, useEffect } from 'react';
import { incomeSourceService } from '../services/incomeSourceService';

export const useIncomeSources = () => {
  const [incomeSources, setIncomeSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncomeSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incomeSourceService.getAll();
      setIncomeSources(data);
    } catch (err) {
      setError(err.message || 'Error al cargar fuentes de ingreso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeSources();
  }, []);

  return { incomeSources, loading, error, refetch: fetchIncomeSources };
};
