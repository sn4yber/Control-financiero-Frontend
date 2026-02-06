import { useMemo } from 'react';

export const useChartData = (movements) => {
  return useMemo(() => {
    // Get last 6 months
    const today = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        date: d,
        label: d.toLocaleString('es-CO', { month: 'short' }),
        income: 0,
        expense: 0
      });
    }

    // Aggregate data
    movements.forEach(m => {
      const mDate = new Date(m.fechaMovimiento);
      const monthIndex = months.findIndex(month => 
        month.date.getMonth() === mDate.getMonth() && 
        month.date.getFullYear() === mDate.getFullYear()
      );

      if (monthIndex !== -1) {
        if (m.tipoMovimiento === 'INCOME') months[monthIndex].income += m.monto;
        if (m.tipoMovimiento === 'EXPENSE') months[monthIndex].expense += m.monto;
      }
    });

    // Find max value for scaling
    const maxVal = Math.max(
      ...months.map(m => Math.max(m.income, m.expense)),
      1000 // Minimum scale
    );

    // Format for chart-kit
    const labels = months.map(m => m.label);
    const incomeData = months.map(m => m.income);
    const expenseData = months.map(m => m.expense);

    return { 
      labels, 
      incomeData, 
      expenseData, 
      maxVal,
      months 
    };
  }, [movements]);
};
