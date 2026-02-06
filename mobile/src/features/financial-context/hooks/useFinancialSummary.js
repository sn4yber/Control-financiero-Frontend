import { useMemo } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

export const useFinancialSummary = () => {
  const { movements, loading, error } = useMovements();

  const summary = useMemo(() => {
    console.log('📊 Total movements loaded:', movements.length);
    
    if (movements.length === 0) {
      return {
        income: 0,
        expense: 0,
        balance: 0,
        savings: 0
      };
    }

    // Calcular totales GLOBALES (históricos) - NO filtrar por mes
    const income = movements
      .filter(m => m.tipoMovimiento === 'INCOME')
      .reduce((acc, m) => acc + m.monto, 0);
    
    const expense = movements
      .filter(m => m.tipoMovimiento === 'EXPENSE')
      .reduce((acc, m) => acc + m.monto, 0);

    const savings = movements
      .filter(m => m.tipoMovimiento === 'SAVINGS')
      .reduce((acc, m) => acc + m.monto, 0);

    console.log('💰 GLOBAL - Income:', income, 'Expense:', expense, 'Balance:', income - expense);

    // Balance = Ingresos - Gastos - Ahorros
    const balance = income - expense - savings;

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
