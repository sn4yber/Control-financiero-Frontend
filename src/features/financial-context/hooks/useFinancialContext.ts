import { useState, useEffect, useCallback } from 'react';
import { financialContextService } from '../services/financialContextService';
import type { FinancialContext } from '../../../core/types/domain';

export const useFinancialContext = () => {
  const [context, setContext] = useState<FinancialContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialContextService.get();
      setContext(data);
    } catch (err: any) {
        // If 404, it just means the user hasn't configured it yet.
        if (err.response && err.response.status === 404) {
            setContext(null);
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

  const saveContext = async (data: Omit<FinancialContext, 'id' | 'codigoMoneda' | 'usuarioId'>) => {
      try {
          setLoading(true);
          // Currently API only supports Create (POST). 
          // If it supported Update (PUT), we would check if context.id exists.
          // Assuming POST creates or updates for the user for now, or we just create a new one.
          // Based on API docs, it's a POST.
          const newContext = await financialContextService.create({
              ...data,
              usuarioId: 0 // Backend infers user from token, but interface might require it. Sending dummy or update interface. 
                           // Actually let's assume service handles it or we update service signature.
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
