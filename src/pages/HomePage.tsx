import { ArrowUpRight, ArrowDownRight, Target, Wallet, Loader2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialSummary } from '../features/financial-context/hooks/useFinancialSummary';
import { useGoals } from '../features/goals/hooks/useGoals';
import { useMovements } from '../features/movements/hooks/useMovements';
import { useChartData } from '../features/reports/hooks/useChartData';
import { Link } from 'react-router-dom';

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
  const userIdStr = localStorage.getItem('userId');
  const userId = userIdStr ? parseInt(userIdStr) : undefined;
  
  // Obtener nombre del usuario si existe
  const userData = localStorage.getItem('user');
  const userName = userData ? JSON.parse(userData).fullName : 'Usuario';

  // Hook de Resumen (Calcula totales de los movimientos)
  const { income, expense, balance, savings, loading: loadingSummary } = useFinancialSummary(userId);
  
  // Hook de Metas
  const { goals, loading: loadingGoals } = useGoals(userId);

  // Hook de Movimientos para Gráfica y Recientes
  const { movements, loading: loadingMovements } = useMovements({ userId });
  const { data: chartData } = useChartData(movements);

  // Últimos 5 movimientos
  const recentMovements = movements.slice(0, 5);

  if (loadingSummary || loadingGoals || loadingMovements) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Hola, {userName.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Aquí tienes el resumen financiero de hoy.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
             Histórico Total
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
               <Wallet size={20} />
             </div>
             <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Disponible</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Balance Total</p>
             <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(balance)}</h3>
           </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-success-light rounded-lg text-success">
               <ArrowUpRight size={20} />
             </div>
             <span className="text-xs font-medium text-success bg-success-light px-2 py-1 rounded-full">Entradas</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Ingresos Totales</p>
             <h3 className="text-2xl font-bold text-success mt-1">+{formatCurrency(income)}</h3>
           </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-danger-light rounded-lg text-danger">
               <ArrowDownRight size={20} />
             </div>
             <span className="text-xs font-medium text-danger bg-danger-light px-2 py-1 rounded-full">Salidas</span>
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Gastos Totales</p>
             <h3 className="text-2xl font-bold text-danger mt-1">-{formatCurrency(expense)}</h3>
           </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
               <Target size={20} />
             </div>
             <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Guardado</span>
           </div>
           <div>
             <div className="flex justify-between items-end mb-1">
                <p className="text-sm text-gray-500 font-medium">Ahorro Total</p>
             </div>
             <h3 className="text-xl font-bold text-gray-900">{formatCurrency(savings)}</h3>
           </div>
        </div>
      </div>
      
      {/* Charts & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Flujo de Caja (Últimos 6 meses)</h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                 <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   <span className="text-gray-500">Ingresos</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-red-500"></span>
                   <span className="text-gray-500">Gastos</span>
                 </div>
              </div>
           </div>
           
           <div className="flex-1 h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
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
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number | undefined) => [formatCurrency(value ?? 0), '']}
                  />
                  <Bar dataKey="income" name="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        
        {/* Goals List */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 overflow-hidden shadow-sm">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-900">Metas Activas</h3>
             <Link to="/goals" className="text-xs text-primary-600 font-medium hover:underline">Ver todas</Link>
           </div>
           
           <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                     <Target className="text-gray-300" size={24} />
                  </div>
                  <p className="text-sm text-gray-400">No tienes metas activas aún.</p>
                  <Link to="/goals" className="mt-2 text-xs font-medium text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50">
                    Crear Meta
                  </Link>
                </div>
              ) : (
                goals.map(goal => {
                  const progress = Math.min((goal.montoActual / goal.montoObjetivo) * 100, 100);
                  const isCompleted = progress >= 100;
                  return (
                    <div key={goal.id} className="p-3 border border-gray-100 rounded-xl hover:border-primary-100 hover:bg-primary-50/10 transition-colors">
                      <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700 truncate max-w-[120px]" title={goal.nombre}>{goal.nombre}</span>
                          <span className="font-medium text-gray-600 text-xs whitespace-nowrap">
                            {formatCurrency(goal.montoActual)}
                          </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-success' : 'bg-primary-500'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-gray-400">{Math.round(progress)}%</span>
                          <span className="text-[10px] text-gray-400">Meta: {formatCurrency(goal.montoObjetivo)}</span>
                      </div>
                    </div>
                  );
                })
              )}
           </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Transacciones Recientes</h3>
            <Link to="/transactions" className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
               Ver todas <ArrowRight size={16} />
            </Link>
        </div>
        
        {recentMovements.length === 0 ? (
           <p className="text-center text-gray-400 py-8 text-sm">No hay movimientos recientes.</p>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500 font-medium">
                 <tr>
                   <th className="px-4 py-3 rounded-l-lg">Descripción</th>
                   <th className="px-4 py-3">Categoría</th>
                   <th className="px-4 py-3">Fecha</th>
                   <th className="px-4 py-3 text-right rounded-r-lg">Monto</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {recentMovements.map(m => (
                   <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-4 py-3 font-medium text-gray-900">{m.descripcion}</td>
                     <td className="px-4 py-3 text-gray-500">
                       {m.categoria ? (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                           {m.categoria.nombre}
                         </span>
                       ) : (
                         <span className="text-gray-400 italic">Sin categoría</span>
                       )}
                     </td>
                     <td className="px-4 py-3 text-gray-500">{new Date(m.fecha).toLocaleDateString()}</td>
                     <td className={`px-4 py-3 text-right font-bold ${m.tipo === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                       {m.tipo === 'INCOME' ? '+' : '-'}{formatCurrency(m.monto)}
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
