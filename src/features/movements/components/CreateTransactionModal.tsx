import { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle, Plus } from 'lucide-react';
import { useCreateMovement } from '../hooks/useCreateMovement';
import { useCategories } from '../../categories/hooks/useCategories';
import { categoryService } from '../../categories/services/categoryService';
import { useIncomeSources } from '../../income-sources/hooks/useIncomeSources';
import { incomeSourceService } from '../../income-sources/services/incomeSourceService';
import { useGoals } from '../../goals/hooks/useGoals';
import type { MovementType } from '../../../core/types/domain';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTransactionModal = ({ isOpen, onClose, onSuccess }: CreateTransactionModalProps) => {
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

  // Category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategoryLoading, setCreatingCategoryLoading] = useState(false);

  // Income Source creation state
  const [isCreatingSource, setIsCreatingSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [creatingSourceLoading, setCreatingSourceLoading] = useState(false);

  const { createMovement, loading, error } = useCreateMovement();
  
  const { categories, refreshCategories } = useCategories(type === 'EXPENSE' ? 'EXPENSE' : undefined); 
  const { sources, refreshSources } = useIncomeSources();
  const { goals } = useGoals();

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setIncomeSourceId('');
      setGoalId('');
      setIsRecurrent(false);
      setRecurrencePattern('MENSUAL');
      setType('EXPENSE');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleCreateSource = async () => {
    if (!newSourceName.trim()) return;
    
    try {
      setCreatingSourceLoading(true);
      const newSrc = await incomeSourceService.create({
        nombre: newSourceName,
        descripcion: 'Creada desde modal',
        tipo: 'OTHER',
        esIngresoReal: true,
        activa: true
      });
      
      await refreshSources();
      setIncomeSourceId(newSrc.id);
      setIsCreatingSource(false);
      setNewSourceName('');
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingSourceLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setCreatingCategoryLoading(true);
      const newCat = await categoryService.create({
        nombre: newCategoryName,
        descripcion: 'Creada desde modal',
        color: '#6B7280', // Default gray
        icono: 'tag',
        tipo: 'EXPENSE',
        activa: true
      });
      
      await refreshCategories();
      setCategoryId(newCat.id);
      setIsCreatingCategory(false);
      setNewCategoryName('');
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingCategoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMovement({
        tipoMovimiento: type,
        monto: parseFloat(amount),
        descripcion: description,
        fechaMovimiento: date,
        esRecurrente: isRecurrent,
        patronRecurrencia: isRecurrent ? recurrencePattern : null,
        // Send IDs only if selected and relevant to type
        categoriaId: type === 'EXPENSE' ? (categoryId || null) : null,
        fuenteIngresoId: type === 'INCOME' ? (incomeSourceId || null) : null,
        metaId: type === 'SAVINGS' ? (goalId || null) : null
      });
      
      onSuccess();
      onClose();
      // Reset fields
      setAmount('');
      setDescription('');
      setCategoryId('');
      setIncomeSourceId('');
      setGoalId('');
      setIsRecurrent(false);
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
               <div className="flex items-center justify-between mb-1">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Fuente / Categoría</label>
                 {!isCreatingSource ? (
                   <button 
                    type="button" 
                    onClick={() => setIsCreatingSource(true)}
                    className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                   >
                     <Plus size={14} /> Nueva
                   </button>
                 ) : (
                   <button 
                    type="button" 
                    onClick={() => {
                      setIsCreatingSource(false);
                      setNewSourceName('');
                    }}
                    className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
                   >
                     <X size={14} /> Cancelar
                   </button>
                 )}
               </div>

               {isCreatingSource ? (
                 <div className="flex gap-2">
                   <input 
                     type="text"
                     value={newSourceName}
                     onChange={(e) => setNewSourceName(e.target.value)}
                     placeholder="Nombre de la nueva fuente"
                     className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
                     autoFocus
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         e.preventDefault();
                         handleCreateSource();
                       }
                     }}
                   />
                   <button
                    type="button"
                    onClick={handleCreateSource}
                    disabled={creatingSourceLoading || !newSourceName.trim()}
                    className="px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                   >
                     {creatingSourceLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={20} />}
                   </button>
                 </div>
               ) : (
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
               )}
             </div>
          )}

          {/* EXPENSE: Category */}
          {type === 'EXPENSE' && (
             <div>
               <div className="flex items-center justify-between mb-1">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</label>
                 {!isCreatingCategory ? (
                   <button 
                    type="button" 
                    onClick={() => setIsCreatingCategory(true)}
                    className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                   >
                     <Plus size={14} /> Nueva
                   </button>
                 ) : (
                   <button 
                    type="button" 
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
                   >
                     <X size={14} /> Cancelar
                   </button>
                 )}
               </div>
               
               {isCreatingCategory ? (
                 <div className="flex gap-2">
                   <input 
                     type="text"
                     value={newCategoryName}
                     onChange={(e) => setNewCategoryName(e.target.value)}
                     placeholder="Nombre de la nueva categoría"
                     className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
                     autoFocus
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         e.preventDefault();
                         handleCreateCategory();
                       }
                     }}
                   />
                   <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategoryLoading || !newCategoryName.trim()}
                    className="px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                   >
                     {creatingCategoryLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={20} />}
                   </button>
                 </div>
               ) : (
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
               )}
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
