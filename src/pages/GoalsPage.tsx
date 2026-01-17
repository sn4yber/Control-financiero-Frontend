import { useState } from 'react';
import { useGoals } from '../features/goals/hooks/useGoals';
import { useDeleteGoal } from '../features/goals/hooks/useDeleteGoal';
import { CreateGoalModal } from '../features/goals/components/CreateGoalModal';
import { Target, Plus, Loader2, Trophy, Clock, TrendingUp, Trash2, Pencil } from 'lucide-react';
import type { FinancialGoal } from '../core/types/domain';

export const GoalsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);

  const { goals, loading, error, refetch } = useGoals();
  const { deleteGoal, loading: deleting } = useDeleteGoal();

  const handleEdit = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedGoal(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta meta?')) {
      try {
        await deleteGoal(id);
        refetch();
      } catch (error: any) {
        console.error('Error deleting goal:', error);
        if (error.response && error.response.status === 409) {
           alert('No se puede eliminar esta meta porque tiene movimientos asociados.');
        } else {
           alert('Hubo un error al eliminar la meta.');
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  const getDaysLeft = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Hoy';
    return `${diffDays} días restantes`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metas Financieras</h1>
          <p className="text-gray-500 mt-1">Define objetivos y sigue tu progreso.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-900/20"
        >
          <Plus size={20} />
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
           <div className="h-96 flex flex-col items-center justify-center text-red-500 p-8 text-center bg-white rounded-2xl border border-red-100">
             <p className="font-medium">Ocurrió un error al cargar las metas</p>
             <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">Reintentar</button>
           </div>
        ) : goals.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Trophy size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-gray-900">No tienes metas activas</p>
            <p className="text-sm mt-1 mb-4">¡Crea tu primera meta de ahorro hoy!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {goals.map((goal) => {
               const progress = calculateProgress(goal.montoActual, goal.montoObjetivo);
               const daysLeft = getDaysLeft(goal.fechaObjetivo);
               
               return (
                 <div key={goal.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEdit(goal)}
                            className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                            title="Editar meta"
                        >
                            <Pencil size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(goal.id)}
                            disabled={deleting}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="Eliminar meta"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 pr-16">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                         <Target size={24} />
                       </div>
                       <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                         daysLeft === 'Vencida' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                       }`}>
                         {daysLeft}
                       </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{goal.nombre}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{goal.descripcion}</p>

                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                          <span className="text-gray-500">{formatCurrency(goal.montoActual)} / {formatCurrency(goal.montoObjetivo)}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Footer Info */}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-50 text-xs text-gray-500">
                         <div className="flex items-center gap-1">
                           <Clock size={14} />
                           <span>{new Date(goal.fechaObjetivo).toLocaleDateString()}</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <TrendingUp size={14} />
                           <span>{goal.prioridad} Priority</span>
                         </div>
                      </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>

      <CreateGoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedGoal}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
      />
    </div>
  );
};
