import { ArrowUpRight, ArrowDownRight, Target, Wallet, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useFinancialSummary } from '../features/financial-context/hooks/useFinancialSummary';
import { useGoals } from '../features/goals/hooks/useGoals';
import { useMovements } from '../features/movements/hooks/useMovements';
import { useCategories } from '../features/categories/hooks/useCategories';
import { useIncomeSources } from '../features/income-sources/hooks/useIncomeSources';
import { useChartData } from '../features/reports/hooks/useChartData';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTheme } from '../core/context/ThemeContext';
import { Skeleton } from '../shared/components/ui/Skeleton';

// Helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const HomePage = () => {
  const { theme } = useTheme();
  
  // Obtener nombre del usuario si existe
  const userData = localStorage.getItem('user');
  const userName = userData ? JSON.parse(userData).fullName : 'Usuario';

  // Hook de Resumen (Calcula totales de los movimientos)
  const { income, expense, balance, savings, loading: loadingSummary, error: summaryError } = useFinancialSummary();
  
  // Hook de Metas
  const { goals, loading: loadingGoals } = useGoals();

  // Hook de Movimientos para Gráfica y Recientes
  const { movements, loading: loadingMovements } = useMovements();
  const { data: chartData } = useChartData(movements);

  // Hooks de Catálogos para lookup manual si falla el backend
  const { categories } = useCategories();
  const { sources } = useIncomeSources();

  // Saludo dinámico
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Cálculo local de respaldo si falla el endpoint de resumen
  const localSummary = useMemo(() => {
    if (!summaryError) return null;
    
    // Filtrar movimientos del mes actual para que coincida con la vista por defecto
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyMovements = movements.filter(m => {
      const date = new Date(m.fechaMovimiento);
      return date >= startOfMonth && date <= endOfMonth;
    });

    const incomeCalc = monthlyMovements
      .filter(m => m.tipoMovimiento === 'INCOME')
      .reduce((acc, m) => acc + m.monto, 0);
      
    const expenseCalc = monthlyMovements
      .filter(m => m.tipoMovimiento === 'EXPENSE')
      .reduce((acc, m) => acc + m.monto, 0);

    // Savings logic depend on specific movement type 'SAVINGS' if exists, or just INCOME - EXPENSE?
    // Based on domain, 'SAVINGS' is a movement type.
    const savingsCalc = monthlyMovements
      .filter(m => m.tipoMovimiento === 'SAVINGS')
      .reduce((acc, m) => acc + m.monto, 0);

    return {
      income: incomeCalc,
      expense: expenseCalc,
      balance: incomeCalc - expenseCalc - savingsCalc, // Basic cashflow logic
      savings: savingsCalc
    };
  }, [movements, summaryError]);

  const displayIncome = localSummary ? localSummary.income : income;
  const displayExpense = localSummary ? localSummary.expense : expense;
  const displayBalance = localSummary ? localSummary.balance : balance;
  const displaySavings = localSummary ? localSummary.savings : savings;

  // Últimos 5 movimientos
  const recentMovements = movements.slice(0, 5);

  // Calcular datos para gráfico de torta (Gastos por Categoría)
  const expensesByCategoryChart = useMemo(() => {
    const expenses = movements.filter(m => m.tipoMovimiento === 'EXPENSE');
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(m => {
      // Usar nombre de categoría o 'Sin categoría'
      // La lógica de nombre es la misma que usamos en la tabla
      const catName = m.categoriaNombre 
        || categories.find(c => c.id === m.categoriaId)?.nombre 
        || 'Sin Categoría';
      
      categoryTotals[catName] = (categoryTotals[catName] || 0) + m.monto;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Ordenar mayor a menor
      .slice(0, 5); // Top 5
  }, [movements, categories]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  if (loadingSummary || loadingGoals || loadingMovements) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>

        {/* Charts Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
             <Skeleton className="h-96 rounded-2xl" />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Error Banner - Solo mostrar si falló el backend Y no pudimos calcularlo localmente */}
      {summaryError && !localSummary && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <span>⚠️ Hubo un problema cargando tu resumen. Intenta recargar la página.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()}, {userName.split(' ')[0]}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Aquí tienes el resumen financiero de hoy.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
             Histórico Total
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
               <Wallet size={20} />
             </div>
             <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900 px-2 py-1 rounded-full">Disponible</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Balance Total</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(displayBalance)}</h3>
           </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-success-light dark:bg-green-900/20 rounded-lg text-success dark:text-green-400 group-hover:scale-110 transition-transform">
               <ArrowUpRight size={20} />
             </div>
             <span className="text-xs font-medium text-success dark:text-green-400 bg-success-light dark:bg-green-900/20 px-2 py-1 rounded-full">Entradas</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ingresos Totales</p>
             <h3 className="text-2xl font-bold text-success dark:text-green-400 mt-1">+{formatCurrency(displayIncome)}</h3>
           </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-danger-light dark:bg-red-900/20 rounded-lg text-danger dark:text-red-400 group-hover:scale-110 transition-transform">
               <ArrowDownRight size={20} />
             </div>
             <span className="text-xs font-medium text-danger dark:text-red-400 bg-danger-light dark:bg-red-900/20 px-2 py-1 rounded-full">Salidas</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Gastos Totales</p>
             <h3 className="text-2xl font-bold text-danger dark:text-red-400 mt-1">-{formatCurrency(displayExpense)}</h3>
           </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
               <Target size={20} />
             </div>
             <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">Retenido</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ahorro Total</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(displaySavings)}</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm transition-colors">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Flujo de Caja (Últimos 6 meses)</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                 <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   <span className="text-gray-500 dark:text-gray-400">Ingresos</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-red-500"></span>
                   <span className="text-gray-500 dark:text-gray-400">Gastos</span>
                 </div>
              </div>
           </div>
           
           <div className="flex-1 h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncomeHome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenseHome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                    tickFormatter={(value) => `$${value / 1000}k`} 
                  />
                  <Tooltip 
                    cursor={{ stroke: theme === 'dark' ? '#334155' : '#e5e7eb', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      borderColor: theme === 'dark' ? '#334155' : '#e5e7eb',
                      color: theme === 'dark' ? '#f3f4f6' : '#111827',
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}
                    labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}
                    formatter={(value: number | undefined) => [formatCurrency(value || 0), '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name="Ingresos" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncomeHome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    name="Gastos" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorExpenseHome)" 
                  />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Expenses by Category Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col shadow-sm transition-colors">
           <h3 className="font-bold text-gray-900 dark:text-white mb-4">Gastos por Categoría</h3>
           <div className="flex-1 h-64 w-full relative">
              {expensesByCategoryChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategoryChart}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expensesByCategoryChart.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number | undefined) => formatCurrency(value || 0)}
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        borderColor: theme === 'dark' ? '#334155' : '#e5e7eb',
                        color: theme === 'dark' ? '#f3f4f6' : '#111827',
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }}
                      itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#374151' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                     <Target className="text-gray-300 dark:text-gray-500" size={24} />
                  </div>
                  <p className="text-sm">No hay gastos para mostrar</p>
                </div>
              )}
              
              {/* Center Text (Total Expenses) */}
               {expensesByCategoryChart.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                   <div className="text-center">
                      <p className="text-xs text-text-secondary dark:text-gray-400">Total</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {formatCurrency(expensesByCategoryChart.reduce((a, b) => a + b.value, 0))}
                      </p>
                   </div>
                </div>
               )}
           </div>
        </div>
      </div>
      
      {/* Goals List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col gap-4 overflow-hidden shadow-sm transition-colors">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white">Metas Activas</h3>
             <Link to="/goals" className="text-xs text-primary-600 font-medium hover:underline">Ver todas</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-sm">No tienes metas activas aún.</p>
                  <Link to="/goals" className="mt-2 text-xs font-medium text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-700">
                    Crear Meta
                  </Link>
                </div>
              ) : (
                goals.map(goal => {
                  const progress = Math.min((goal.montoActual / goal.montoObjetivo) * 100, 100);
                  const isCompleted = progress >= 100;
                  return (
                    <div key={goal.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                      <div className="flex justify-between text-base mb-2">
                          <span className="font-medium text-gray-800 dark:text-white truncate" title={goal.nombre}>{goal.nombre}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2 text-gray-500 dark:text-gray-400">
                         <span>Actual: {formatCurrency(goal.montoActual)}</span>
                         <span>Meta: {formatCurrency(goal.montoObjetivo)}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-success' : 'bg-primary-500'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                          <span className={`text-xs font-bold ${isCompleted ? 'text-success dark:text-green-400' : 'text-primary-600 dark:text-primary-400'}`}>{Math.round(progress)}% Completado</span>
                      </div>
                    </div>
                  );
                })
              )}
           </div>
        </div>
      
      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Transacciones Recientes</h3>
            <Link to="/transactions" className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
               Ver todas <ArrowRight size={16} />
            </Link>
        </div>
        
        {recentMovements.length === 0 ? (
           <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">No hay movimientos recientes.</p>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-medium">
                 <tr>
                   <th className="px-4 py-3 rounded-l-lg">Descripción</th>
                   <th className="px-4 py-3">Categoría</th>
                   <th className="px-4 py-3">Fecha</th>
                   <th className="px-4 py-3 text-right rounded-r-lg">Monto</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                 {recentMovements.map(m => (
                   <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{m.descripcion}</td>
                     <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                       {(() => {
                         const catName = m.categoriaNombre 
                           || m.fuenteIngresoNombre 
                           || categories.find(c => c.id === m.categoriaId)?.nombre 
                           || sources.find(s => s.id === m.fuenteIngresoId)?.nombre;
                           
                         return catName ? (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300">
                             {catName}
                           </span>
                         ) : (
                           <span className="text-gray-400 italic">Sin categoría</span>
                         );
                       })()}
                     </td>
                     <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(m.fechaMovimiento).toLocaleDateString()}</td>
                     <td className={`px-4 py-3 text-right font-bold ${m.tipoMovimiento === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                       {m.tipoMovimiento === 'INCOME' ? '+' : '-'}{formatCurrency(m.monto)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
};
