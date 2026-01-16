import { Link } from 'react-router-dom';
import { useReports } from '../features/reports/hooks/useReports';
import { AlertTriangle, Calculator } from 'lucide-react';

export const BudgetsPage = () => {
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? parseInt(userIdStr) : undefined;
    
    // We reuse the reports hook to get data derived from movements
    const { stats, loading, selectedMonth } = useReports(userId);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) return null; // Let the Reports hook handle its own loading or just show null here for smoothness

    // 50/30/20 Rule
    // 50% Needs, 30% Wants, 20% Savings
    // Since we don't have "Needs" vs "Wants" categories yet, we can't fully automate this.
    // So we will just show a "Presupuesto Sugerido" based on current Income.
    
    const income = stats?.income || 0;
    const suggestedNeeds = income * 0.5;
    const suggestedWants = income * 0.3;
    const suggestedSavings = income * 0.2;

    const totalSpent = stats?.expense || 0;
    
    // Simple logic: If we don't know category types, we just show overall specific limits logic helper
    
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
          <p className="text-gray-500 mt-1">Planifica tus gastos basado en tus ingresos reales.</p>
        </div>
      </div>

        {!stats || stats.income === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-blue-500" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Calculadora de Presupuesto 50/30/20</h3>
                 <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Para generar un presupuesto sugerido, primero necesitas registrar ingresos este mes ({selectedMonth.toLocaleString('es-CO', { month: 'long'})}).
                 </p>
                 <Link to="/transactions" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                    Registrar Ingreso
                 </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Intro Card */}
                <div className="lg:col-span-2 bg-gradient-to-r from-primary-900 to-primary-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 w-full md:w-2/3">
                        <h2 className="text-2xl font-bold mb-2">Regla 50/30/20</h2>
                        <p className="text-primary-100 mb-6">
                            Una estrategia simple para administrar tu dinero: 50% para Necesidades, 30% para Deseos y 20% para Ahorros.
                            Basado en tus ingresos de <strong>{formatCurrency(income)}</strong>, así podrías distribuir tu dinero:
                        </p>
                    </div>
                </div>

                {/* Suggestions Grid */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">50%</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Necesidades</h3>
                                    <p className="text-xs text-gray-500">Renta, servicios, comida...</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-purple-600">{formatCurrency(suggestedNeeds)}</span>
                        </div>
                        <div className="p-3 bg-purple-50/50 rounded-lg text-sm text-purple-800">
                           Límite sugerido para gastos esenciales.
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold">30%</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Deseos / Ocio</h3>
                                    <p className="text-xs text-gray-500">Salidas, hobbies, compras...</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-pink-600">{formatCurrency(suggestedWants)}</span>
                        </div>
                         <div className="p-3 bg-pink-50/50 rounded-lg text-sm text-pink-800">
                           Límite sugerido para estilo de vida.
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">20%</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Ahorro / Inversión</h3>
                                    <p className="text-xs text-gray-500">Metas, fondo de emergencia...</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-blue-600">{formatCurrency(suggestedSavings)}</span>
                        </div>
                         <div className="p-3 bg-blue-50/50 rounded-lg text-sm text-blue-800">
                           Monto sugerido para tu futuro.
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-900 mb-6">Tu Estado Actual</h3>
                   
                   <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Total Gastado</span>
                                <span className="font-bold text-gray-900">{formatCurrency(totalSpent)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                <div className={`h-full rounded-full ${totalSpent > income ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((totalSpent/income)*100, 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-center mt-2 text-gray-400">
                                {totalSpent > income 
                                    ? `Has excedido tus ingresos por ${formatCurrency(totalSpent - income)}` 
                                    : `Has consumido el ${Math.round((totalSpent/income)*100)}% de tus ingresos`
                                }
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-bold mb-1">Nota Importante</p>
                                    <p>Esta es una herramienta de planificación. Para un control estricto, asegúrate de categorizar correctamente todos tus movimientos.</p>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>

            </div>
        )}
    </div>
  );
};
