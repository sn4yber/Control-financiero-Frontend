import { useState } from 'react';
import { useReports } from '../features/reports/hooks/useReports';
import { useFinancialContext } from '../features/financial-context/hooks/useFinancialContext';
import { AlertTriangle, Calculator, DollarSign, Wallet } from 'lucide-react';
import { CreateTransactionModal } from '../features/movements/components/CreateTransactionModal';

export const BudgetsPage = () => {
    // We reuse the reports hook to get data derived from movements
    const { stats, loading, refetch } = useReports();
    const { context } = useFinancialContext();
    
    const [simulationAmount, setSimulationAmount] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    // Determine the base amount for the budget view (income OR simulation)
    const baseAmount = simulationAmount ? parseFloat(simulationAmount) : income;

    // Custom or Default Savings Rate
    const savingsPercentage = context?.porcentajeAhorroDeseado || 20; // Default 20%
    const remainingPercentage = 100 - savingsPercentage;
    
    // Distribute remaining based on 50/30 ratio (5/8 needs, 3/8 wants)
    const needsPercentage = Math.round(remainingPercentage * 0.625);
    const wantsPercentage = Math.round(remainingPercentage * 0.375);

    const suggestedNeeds = baseAmount * (needsPercentage / 100);
    const suggestedWants = baseAmount * (wantsPercentage / 100);
    const suggestedSavings = baseAmount * (savingsPercentage / 100);

    const totalSpent = stats?.expense || 0;
    
    // Simple logic: If we don't know category types, we just show overall specific limits logic helper
    
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calculadora de Presupuesto</h1>
          <p className="text-gray-500 mt-1">Planifica tus gastos usando la regla 50/30/20.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
         <div className="flex flex-col md:flex-row gap-6 items-end">
             <div className="flex-1 w-full">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                    {stats?.income && stats.income > 0 ? 'Tu Ingreso Mensual Registrado' : 'Ingresa tu ingreso mensual para calcular'}
                 </label>
                 <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="number" 
                        value={simulationAmount}
                        onChange={(e) => setSimulationAmount(e.target.value)}
                        placeholder={income > 0 ? income.toString() : "Ej: 2500000"}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                 </div>
             </div>
             
             {(!stats?.income || stats.income === 0) && (
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2"
                 >
                     <Wallet size={20} /> Registrar este Ingreso
                 </button>
             )}
         </div>
      </div>

      {baseAmount > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* Intro Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                 {/* Window Controls */}
                 <div className="flex p-4 gap-2 bg-gray-50/50 border-b border-gray-100">
                    <span className="bg-blue-500 w-3 h-3 rounded-full" />
                    <span className="bg-purple-500 w-3 h-3 rounded-full" />
                    <span className="bg-pink-500 w-3 h-3 rounded-full" />
                 </div>
                 
                 <div className="p-8 relative">
                    <div className="relative z-10 w-full md:w-2/3">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Total de {formatCurrency(baseAmount)}</h2>
                        <p className="text-gray-500 mb-6 text-lg">
                            Basado en tu meta de ahorro del <strong className="text-primary-600">{savingsPercentage}%</strong>, así deberías distribuir este dinero para unas finanzas saludables:
                        </p>
                    </div>
                    <Calculator className="absolute -right-8 -bottom-8 text-primary-900/5 w-64 h-64 rotate-12" />
                 </div>
            </div>

            {/* Suggestions Grid */}
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg">{needsPercentage}%</span>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Necesidades Básicas</h3>
                                <p className="text-sm text-gray-500">Renta, servicios, mercado</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">{formatCurrency(suggestedNeeds)}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-lg">{wantsPercentage}%</span>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Deseos y Ocio</h3>
                                <p className="text-sm text-gray-500">Salidas, hobbies, gustos</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-pink-600">{formatCurrency(suggestedWants)}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">{savingsPercentage}%</span>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Ahorro e Inversión</h3>
                                <p className="text-sm text-gray-500">Fondo de emergencia, deudas</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(suggestedSavings)}</span>
                    </div>
                </div>
            </div>

            {/* Existing spending context if connected to real data */}
            {income > 0 && (
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tu Realidad Mensual</h3>
                    
                    <div className="space-y-6">
                         <div>
                             <div className="flex justify-between text-sm mb-2">
                                 <span className="text-gray-500">Total Gastado Real</span>
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
                                     <p className="font-bold mb-1">Nota</p>
                                     <p>Los cálculos de la izquierda son ideales. Ajusta tus gastos reales para acercarte a estos números.</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                 </div>
            )}
        </div>
      ) : (
        <div className="text-center py-12 opacity-50">
             <Calculator strokeWidth={1} size={64} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500">Ingresa un monto arriba para ver la proyección</p>
        </div>
      )}

      <CreateTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
            refetch();
            setSimulationAmount('');
        }}
      />
    </div>
  );
};
