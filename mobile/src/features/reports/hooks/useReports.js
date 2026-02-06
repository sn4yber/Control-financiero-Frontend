import { useMemo } from 'react';
import { useMovements } from '../../movements/hooks/useMovements';

export const useReports = (selectedMonth = new Date()) => {
  const { movements, loading, error, refetch } = useMovements();

  const stats = useMemo(() => {
    console.log('📈 ReportsPage - Total movements:', movements.length);
    
    if (!movements.length) {
      return {
        income: 0,
        expenses: 0,
        balance: 0,
        topCategories: [],
        topSources: [],
        totalTransactions: 0
      };
    }

    // Filter by selected month
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const currentMonthMovements = movements.filter(m => {
      const d = new Date(m.fechaMovimiento);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    console.log('📅 ReportsPage - Month movements:', currentMonthMovements.length);

    // Totals
    const income = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'INCOME')
      .reduce((acc, curr) => acc + curr.monto, 0);

    const expenses = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.monto, 0);
    
    console.log('💸 ReportsPage - Income:', income, 'Expenses:', expenses);
    
    // Expenses by Category
    const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];
    const expensesByCategory = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE' && m.categoriaNombre)
      .reduce((acc, curr) => {
        const catName = curr.categoriaNombre;
        
        if (!acc[catName]) {
          const color = COLORS[Object.keys(acc).length % COLORS.length];
          acc[catName] = { total: 0, color, count: 0, nombre: catName };
        }
        acc[catName].total += curr.monto;
        acc[catName].count += 1;
        return acc;
      }, {});

    const topCategories = Object.values(expensesByCategory)
      .sort((a, b) => b.total - a.total);

    // Income by Source
    const incomeBySource = currentMonthMovements
      .filter(m => m.tipoMovimiento === 'INCOME' && m.fuenteIngresoNombre)
      .reduce((acc, curr) => {
        const sourceName = curr.fuenteIngresoNombre;
        
        if (!acc[sourceName]) {
          const color = COLORS[Object.keys(acc).length % COLORS.length];
          acc[sourceName] = { total: 0, color, count: 0, nombre: sourceName };
        }
        acc[sourceName].total += curr.monto;
        acc[sourceName].count += 1;
        return acc;
      }, {});

    const topSources = Object.values(incomeBySource)
      .sort((a, b) => b.total - a.total);

    return {
      income,
      expenses,
      balance: income - expenses,
      topCategories,
      topSources,
      totalTransactions: currentMonthMovements.length
    };
  }, [movements, selectedMonth]);

  return { 
    stats, 
    loading, 
    error, 
    refetch
  };
};
