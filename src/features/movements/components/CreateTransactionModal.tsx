import { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
import { useCreateMovement } from '../hooks/useCreateMovement';
import { useCategories } from '../../categories/hooks/useCategories';
import { useIncomeSources } from '../../income-sources/hooks/useIncomeSources';
import { useGoals } from '../../goals/hooks/useGoals';
import type { MovementType } from '../../../core/types/domain';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTransactionModal = ({ isOpen, onClose, onSuccess }: CreateTransactionModalProps) => {
  const userIdStr = localStorage.getItem('userId');
  const userId = userIdStr ? parseInt(userIdStr) : undefined;
  
  const [type, setType] = useState<MovementType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Optional relations
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [incomeSourceId, setIncomeSourceId] = useState<number | ''>('');
  const [goalId, setGoalId] = useState<number | ''>('');
  
  // Recurrence
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<string>('MENSUAL');

  const { createMovement, loading, error } = useCreateMovement();
  
  // Fetch dependencies only when modal is open to avoid background errors and flashing
  const shouldFetch = isOpen && typeof userId === 'number';
  
  const { categories } = useCategories(shouldFetch ? userId : undefined, type === 'EXPENSE' ? 'EXPENSE' : undefined); 
  const { sources } = useIncomeSources(shouldFetch ? userId : undefined);
  const { goals } = useGoals(shouldFetch ? userId : undefined);

  // Reset form when opening/closing or changing type
  useEffect(() => {
    if (isOpen) {
        // keep defaults
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await createMovement({
        usuarioId: userId,
        tipoMovimiento: type,
        monto: parseFloat(amount),
        descripcion: description,
        fechaMovimiento: date,
        esRecurrente: isRecurrent,
        patronRecurrencia: isRecurrent ? recurrencePattern : null,
        // Send IDs only if selected
        categoriaId: categoryId || null,
        fuenteIngresoId: incomeSourceId || null,
        metaId: goalId || null
      });
      
      onSuccess();
      onClose();
      // Reset basic fields
      setAmount('');
      setDescription('');
      setCategoryId('');
    } catch {
      // Error handling is done via hook state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Movimiento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === 'INCOME' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === 'EXPENSE' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gasto
            </button> 
             <button
              type="button"
              onClick={() => setType('SAVINGS')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === 'SAVINGS' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ahorro
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 rounded-xl text-lg font-bold text-gray-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Descripción</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Salario, Compras, Cine..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-50 rounded-xl transition-all outline-none"
            />
          </div>

          {/* Dynamic Fields based on Type */}
          
          {/* INCOME: Income Source */}
          {type === 'INCOME' && (
             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fuente de Ingreso</label>
               <select
                 value={incomeSourceId}
                 onChange={(e) => setIncomeSourceId(Number(e.target.value))}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
               >
                 <option value="">Seleccionar fuente (Opcional)</option>
                 {sources.map(src => (
                   <option key={src.id} value={src.id}>{src.nombre}</option>
                 ))}
               </select>
             </div>
          )}

          {/* EXPENSE: Category */}
          {type === 'EXPENSE' && (
             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
               <select
                 value={categoryId}
                 onChange={(e) => setCategoryId(Number(e.target.value))}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
               >
                 <option value="">Seleccionar categoría (Opcional)</option>
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                 ))}
               </select>
             </div>
          )}

           {/* SAVINGS/GOAL: Goal Selection */}
           {type === 'SAVINGS' && (
             <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Meta Relacionada</label>
               <select
                 value={goalId}
                 onChange={(e) => setGoalId(Number(e.target.value))}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
               >
                 <option value="">Seleccionar meta (Opcional)</option>
                 {goals.map(goal => (
                   <option key={goal.id} value={goal.id}>{goal.nombre}</option>
                 ))}
               </select>
             </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fecha</label>
            <div className="relative">
               <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="date"
                 required
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
               />
            </div>
          </div>

          {/* Recurrence */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="recurrence"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="recurrence" className="text-sm font-medium text-gray-900 select-none">
                ¿Es un movimiento recurrente?
              </label>
            </div>
            
            {isRecurrent && (
              <div className="mt-3 animate-in slide-in-from-top-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Frecuencia</label>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 focus:border-primary-500 rounded-lg text-sm outline-none"
                >
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="QUINCENAL">Quincenal</option>
                  <option value="MENSUAL">Mensual</option>
                  <option value="ANUAL">Anual</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={20} />}
              <span>Guardar Movimiento</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
