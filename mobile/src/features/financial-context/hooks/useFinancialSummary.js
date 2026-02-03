import { useMemo } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

export const useFinancialSummary = () => {
  const { movements, loading, error } = useMovements();

  const summary = useMemo(() => {
    if (movements.length === 0) {
      return {
        income: 0,
        expense: 0,
        balance: 0,
        savings: 0
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyMovements = movements.filter(m => {
      const dateParts = m.fechaMovimiento.split('T')[0].split('-');
      const localDate = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );
      return localDate >= startOfMonth && localDate <= endOfMonth;
    });

    const income = monthlyMovements
      .filter(m => m.tipoMovimiento === 'INCOME')
      .reduce((acc, m) => acc + m.monto, 0);
    
    const expense = monthlyMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE')
      .reduce((acc, m) => acc + m.monto, 0);

    const savings = monthlyMovements
      .filter(m => m.tipoMovimiento === 'SAVINGS')
      .reduce((acc, m) => acc + m.monto, 0);

    // Balance global (histórico)
    const balance = movements.reduce((acc, m) => {
      if (m.tipoMovimiento === 'INCOME') return acc + m.monto;
      if (m.tipoMovimiento === 'EXPENSE') return acc - m.monto;
      if (m.tipoMovimiento === 'SAVINGS') return acc - m.monto;
      return acc;
    }, 0);

    return {
      income,
      expense,
      balance,
      savings
    };
  }, [movements]);

  return {
    ...summary,
    loading,
    error
  };
};
