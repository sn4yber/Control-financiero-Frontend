import { useMemo } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

// Este hook calcula los totales basándose en los movimientos cargados
// Idealmente esto vendría del backend, pero lo calculamos aquí por ahora (Client-side calculation)
export const useFinancialSummary = (userId?: number) => {
  // Obtenemos todos los movimientos (sin filtro de fecha por defecto trae todo, o podríamos filtrar por mes si se implementara)
  // Para el MVP asumiremos que trae los recientes o el backend filtra por defecto.
  const { movements, loading, error } = useMovements({ userId });

  const summary = useMemo(() => {
    if (!movements.length) return { income: 0, expense: 0, balance: 0, savings: 0 };

    const income = movements
      .filter(m => m.tipo === 'INCOME')
      .reduce((acc, curr) => acc + curr.monto, 0);

    const expense = movements
      .filter(m => m.tipo === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.monto, 0);
      
    const savings = movements
        .filter(m => m.tipo === 'SAVINGS')
        .reduce((acc, curr) => acc + curr.monto, 0);

    return {
      income,
      expense,
      savings,
      balance: income - expense - savings // El ahorro también se resta del balance disponible líquido
    };
  }, [movements]);

  return { ...summary, loading, error };
};
