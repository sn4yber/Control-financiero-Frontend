import { useMemo, useState } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

export const useReports = () => {
  const { movements, loading, error, refetch } = useMovements();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const stats = useMemo(() => {
    if (!movements.length) return null;

    // Filter by selected month
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const currentMonthMovements = movements.filter(m => {
      const d = new Date(m.fechaMovimiento);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    // Totals
    const income = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'INCOME')
      .reduce((acc, curr) => acc + curr.monto, 0);

    const expense = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.monto, 0);
    
    // Expenses by Category
    const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];
    const expensesByCategory = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE' && m.categoriaNombre)
      .reduce((acc, curr) => {
        const catName = curr.categoriaNombre!;
        
        if (!acc[catName]) {
          const color = COLORS[Object.keys(acc).length % COLORS.length];
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
