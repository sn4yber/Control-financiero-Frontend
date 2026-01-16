import { useReports } from '../features/reports/hooks/useReports'; // Relative path from features/reports/components/
import { TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight, BarChart3, Loader2 } from 'lucide-react';

export const ReportsPage = () => {
  const userIdStr = localStorage.getItem('userId');
  const userId = userIdStr ? parseInt(userIdStr) : undefined;
  
  const { stats, loading, error, selectedMonth, setSelectedMonth, refetch } = useReports(userId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedMonth(newDate);
  };

  const monthName = selectedMonth.toLocaleString('es-CO', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes Financieros</h1>
          <p className="text-gray-500 mt-1">Analiza tus patrones de gasto e ingresos.</p>
        </div>
        
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 py-1 min-w-[140px] text-center font-medium capitalize text-gray-900">
            {monthName}
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {loading ? (
         <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
         </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">
          Error al cargar datos. <button onClick={() => refetch()} className="underline">Reintentar</button>
        </div>
      ) : !stats || stats.movementsCount === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BarChart3 size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-gray-900">Sin datos para este mes</p>
            <p className="text-sm mt-1 mb-4">No hay movimientos registrados en {monthName}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Summary Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                 <span className="text-sm text-gray-500 font-medium">Ingresos</span>
               </div>
               <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.income)}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
                 <span className="text-sm text-gray-500 font-medium">Gastos</span>
               </div>
               <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.expense)}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={20} /></div>
                 <span className="text-sm text-gray-500 font-medium">Balance</span>
               </div>
               <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                 {formatCurrency(stats.balance)}
               </p>
            </div>
          </div>

          {/* Categories Chart (Bars) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Gastos por Categoría</h3>
            <div className="space-y-4">
              {stats.categoryRanking.map((cat) => {
                const percentage = stats.expense > 0 ? (cat.amount / stats.expense) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                       <span className="font-medium text-gray-700 flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                         {cat.name}
                       </span>
                       <div className="text-right">
                         <span className="text-gray-900 font-bold block">{formatCurrency(cat.amount)}</span>
                       </div>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full" 
                         style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                       />
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">{Math.round(percentage)}% del total</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights / Savings Rate */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen</h3>
             
             {/* Savings Rate Circle */}
             <div className="flex flex-col items-center justify-center py-8">
               <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#2563eb" strokeWidth="12"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * stats.savingsRate) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{Math.round(stats.savingsRate)}%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Ahorro</span>
                  </div>
               </div>
               <p className="text-center text-gray-500 text-sm mt-4 px-4">
                 {stats.savingsRate > 20 
                   ? '¡Excelente! Estás ahorrando más del 20% de tus ingresos.' 
                   : stats.savingsRate > 0 
                     ? 'Vas bien, pero intenta aumentar tu porcentaje de ahorro.' 
                     : 'Cuidado, tus gastos superan o igualan tus ingresos.'}
               </p>
             </div>

          </div>

        </div>
      )}
    </div>
  );
};
