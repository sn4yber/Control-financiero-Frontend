import { useMemo, useState } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

export const useReports = (userId?: number) => {
  const { movements, loading, error, refetch } = useMovements({ userId });
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const stats = useMemo(() => {
    if (!movements.length) return null;

    // Filter by selected month
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const currentMonthMovements = movements.filter(m => {
      const d = new Date(m.fecha);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    // Totals
    const income = currentMonthMovements
      .filter(m => m.tipo === 'INCOME')
      .reduce((acc, curr) => acc + curr.monto, 0);

    const expense = currentMonthMovements
      .filter(m => m.tipo === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.monto, 0);
    
    // Expenses by Category
    const expensesByCategory = currentMonthMovements
      .filter(m => m.tipo === 'EXPENSE' && m.categoria)
      .reduce((acc, curr) => {
        const catName = curr.categoria!.nombre;
        const color = curr.categoria!.color || '#cccccc';
        if (!acc[catName]) {
          acc[catName] = { amount: 0, color, count: 0 };
        }
        acc[catName].amount += curr.monto;
        acc[catName].count += 1;
        return acc;
      }, {} as Record<string, { amount: number, color: string, count: number }>);

    const categoryRanking = Object.entries(expensesByCategory)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
      categoryRanking,
      movementsCount: currentMonthMovements.length
    };
  }, [movements, selectedMonth]);

  return {
    stats,
    loading,
    error,
    refetch,
    selectedMonth,
    setSelectedMonth
  };
};
