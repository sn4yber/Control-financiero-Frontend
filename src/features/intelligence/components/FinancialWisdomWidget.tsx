import { useFinancialIntelligence } from '../hooks/useFinancialIntelligence';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, BrainCircuit } from 'lucide-react';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

export const FinancialWisdomWidget = () => {
  const { predictions, recommendations, loading, error } = useFinancialIntelligence();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-3 mb-4">
           <Skeleton className="h-8 w-8 rounded-lg" />
           <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    // Fallback UI si hay error
    return (
       <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
         <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
           <AlertTriangle size={18} />
           <p className="font-medium text-sm">No se pudo cargar la inteligencia financiera</p>
         </div>
         <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
           Verifica tu conexión. Mostrando datos demostrativos en breve...
         </p>
       </div>
    );
  }

  // Si no hay datos relevantes aún, mostramos un estado de "Aprendiendo"
  if ((!predictions || predictions.length === 0) && recommendations.length === 0) {
    return (
       <div className="bg-indigo-50 dark:bg-slate-800 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 text-center">
          <div className="inline-flex p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3 text-indigo-500">
             <BrainCircuit size={24} />
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium mb-1">Analizando tus finanzas...</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
             Necesitamos más movimientos para generar predicciones exactas. ¡Sigue registrando tus gastos!
          </p>
       </div>
    );
  }

  // Calcular totales de las predicciones
  const totalPredictedExpense = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);
  const averageConfidence = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length 
    : 0;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-slate-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <BrainCircuit size={120} />
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Sparkles size={20} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Inteligencia Financiera</h2>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Predicciones */}
        {predictions.length > 0 && (
          <div className="ml-1">
             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <TrendingUp size={16} /> Predicción de Gastos (Próximo Mes)
             </h3>
             <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalPredictedExpense)}
                </span>
                <span className={`text-sm mb-1 font-medium ${averageConfidence > 0.7 ? 'text-green-500' : 'text-amber-500'}`}>
                   ({Math.round(averageConfidence * 100)}% confianza)
                </span>
             </div>
             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
               Basado en el análisis de {predictions.length} categorías de gasto.
             </p>
          </div>
        )}

        {/* Recomendaciones (Solo mostrar las top 2 para no saturar) */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Lightbulb size={16} /> Recomendaciones
             </h3>
             {recommendations.slice(0, 2).map((rec, idx) => {
               const isCritical = rec.priority === 'high';
               const isSaving = rec.type === 'saving';
               
               return (
                 <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-slate-700/50 flex gap-3">
                    <div className={`mt-1 shrink-0 ${isSaving ? 'text-green-500' : isCritical ? 'text-red-500' : 'text-blue-500'}`}>
                      {isCritical ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{rec.title}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug mt-0.5">
                        {rec.description}
                      </p>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
};
