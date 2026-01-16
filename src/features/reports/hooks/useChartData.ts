import { useMemo } from 'react';
import type { FinancialMovement } from '../../../core/types/domain';

export const useChartData = (movements: FinancialMovement[]) => {
  return useMemo(() => {
    // 1. Get last 6 months
    const today = new Date();
    const months: { date: Date; label: string; income: number; expense: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        date: d,
        label: d.toLocaleString('es-CO', { month: 'short' }),
        income: 0,
        expense: 0
      });
    }

    // 2. Aggregate data
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

    // 3. Find max value for scaling
    const maxVal = Math.max(
      ...months.map(m => Math.max(m.income, m.expense)),
      1000 // Minimum scale
    );

    return { data: months, maxVal };
  }, [movements]);
};
