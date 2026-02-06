import { useState, useEffect, useCallback } from 'react';
import { financialContextService } from '../services/financialContextService';

export const useFinancialContext = () => {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContext = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialContextService.get();
      setContext(data);
    } catch (err) {
      // If 404 or 500, it just means the user hasn't configured it yet.
      // Backend returns 500 when no financial context exists
      if (err.response && (err.response.status === 404 || err.response.status === 500)) {
        setContext(null);
        setError(null); // No es un error real, solo no existe aún
      } else {
        console.error('Error fetching financial context:', err);
        setError('No se pudo cargar la configuración financiera');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  const saveContext = async (data) => {
    try {
      setLoading(true);
      const newContext = await financialContextService.create({
        ...data,
        usuarioId: 0
      });
      setContext(newContext);
      return newContext;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { context, loading, error, refetch: fetchContext, saveContext };
};
