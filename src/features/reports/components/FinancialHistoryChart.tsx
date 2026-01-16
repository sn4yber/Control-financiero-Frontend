import { useMemo } from 'react';
import { useTheme } from '../../../core/context/ThemeContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface FinancialHistoryChartProps {
  data: Record<string, unknown>[];
}

export const FinancialHistoryChart = ({ data }: FinancialHistoryChartProps) => {
  const { theme } = useTheme();
  
  const chartData = useMemo(() => {
    // Si no hay datos suficientes, generar algunos de ejemplo o devolver vacío
    if (!data || data.length === 0) return [];
    
    // Asumiendo que 'data' ya viene en el formato correcto o transformarlo aquí
    // Para reports, data suele ser chartData del hook useChartData
    return data; 
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Tendencia de Ingresos y Gastos</h3>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(value) => `$${value / 1000000}M`} 
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1e293b' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px', 
                border: theme === 'dark' ? '1px solid #334155' : 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
              formatter={(value: number | undefined) => formatCurrency(value || 0)}
              labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#374151' }}
              itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Gastos"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
