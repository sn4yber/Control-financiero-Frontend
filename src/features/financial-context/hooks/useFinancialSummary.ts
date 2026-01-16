import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type DashboardSummary } from '../../reports/services/dashboardService';

export const useFinancialSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary>({ income: 0, expense: 0, balance: 0, savings: 0, metas: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Por defecto enviamos el mes actual para evitar errores en backend si no maneja bien rangos vacíos
      // y para que coincida con la visualización mensual típica
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const data = await dashboardService.getSummary(startDate, endDate);
      setSummary(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError('Error al cargar el resumen financiero');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { ...summary, loading, error, refetch: fetchSummary };
};
