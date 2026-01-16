import { useState } from 'react';
import { X, Check, AlertCircle, Calendar } from 'lucide-react';
import { useCreateGoal } from '../hooks/useCreateGoal';
import type { GoalPriority } from '../../../core/types/domain';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGoalModal = ({ isOpen, onClose, onSuccess }: CreateGoalModalProps) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [fechaObjetivo, setFechaObjetivo] = useState('');
  const [prioridad, setPrioridad] = useState<GoalPriority>('MEDIUM');

  const { createGoal, loading, error } = useCreateGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createGoal({
        nombre,
        descripcion,
        montoObjetivo: parseFloat(montoObjetivo),
        fechaObjetivo,
        prioridad
      });
      
      onSuccess();
      onClose();
      // Reset form
      setNombre('');
      setDescripcion('');
      setMontoObjetivo('');
      setFechaObjetivo('');
      setPrioridad('MEDIUM');
    } catch {
       // Error handled by hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Nueva Meta Financiera</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre de la Meta</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Viaje a Europa, Fondo de Emergencia..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none transition-all"
            />
          </div>

          {/* Monto Objetivo */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monto Objetivo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                required
                min="0"
                value={montoObjetivo}
                onChange={(e) => setMontoObjetivo(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 rounded-xl text-lg font-bold text-gray-900 transition-all outline-none"
              />
            </div>
          </div>

           {/* Fecha Objetivo */}
           <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fecha Objetivo</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                required
                value={fechaObjetivo}
                onChange={(e) => setFechaObjetivo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Prioridad</label>
            <div className="flex gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as GoalPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrioridad(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    prioridad === p 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p === 'LOW' ? 'Baja' : p === 'MEDIUM' ? 'Media' : p === 'HIGH' ? 'Alta' : 'Crítica'}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Descripción (Opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles sobre tu meta..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none transition-all h-24 resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={20} />}
              <span>Crear Meta</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
