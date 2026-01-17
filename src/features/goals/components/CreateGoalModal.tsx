import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Calendar, Sparkles, Bot } from 'lucide-react';
import { useCreateGoal } from '../hooks/useCreateGoal';
import { useUpdateGoal } from '../hooks/useUpdateGoal';
import { intelligenceService } from '../../intelligence/services/intelligenceService';
import type { GoalPriority, FinancialGoal } from '../../../core/types/domain';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: FinancialGoal | null;
}

export const CreateGoalModal = ({ isOpen, onClose, onSuccess, initialData }: CreateGoalModalProps) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [displayAmount, setDisplayAmount] = useState(''); // Formatted string
  const [fechaObjetivo, setFechaObjetivo] = useState('');
  const [prioridad, setPrioridad] = useState<GoalPriority>('MEDIUM');

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ message: string; severity: 'info' | 'warning' | 'danger' | 'success' } | null>(null);

  const { createGoal, loading: creating, error: createError } = useCreateGoal();
  const { updateGoal, loading: updating, error: updateError } = useUpdateGoal();
  
  const loading = creating || updating;
  const error = createError || updateError;

  const isEditing = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNombre(initialData.nombre);
        setDescripcion(initialData.descripcion);
        setMontoObjetivo(initialData.montoObjetivo.toString());
        setDisplayAmount(new Intl.NumberFormat('es-CO').format(initialData.montoObjetivo));
        setFechaObjetivo(initialData.fechaObjetivo.split('T')[0]);
        setPrioridad(initialData.prioridad);
      } else {
        setNombre('');
        setDescripcion('');
        setMontoObjetivo('');
        setDisplayAmount('');
        setFechaObjetivo('');
        setPrioridad('MEDIUM');
      }
      setAnalysisResult(null);
    }
  }, [isOpen, initialData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Eliminar todo lo que no sea dígito
    const rawValue = e.target.value.replace(/\D/g, '');
    
    if (rawValue === '') {
        setMontoObjetivo('');
        setDisplayAmount('');
        return;
    }

    const numberValue = parseInt(rawValue, 10);
    setMontoObjetivo(numberValue.toString());
    setDisplayAmount(new Intl.NumberFormat('es-CO').format(numberValue));
  };

  const handleAnalyzeGoal = async () => {
    if (!montoObjetivo || !fechaObjetivo) return;
    
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      const result = await intelligenceService.analyzeGoal(parseFloat(montoObjetivo), fechaObjetivo, nombre);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formValues = {
        nombre,
        descripcion,
        montoObjetivo: parseFloat(montoObjetivo),
        fechaObjetivo,
        prioridad
      };

      if (isEditing && initialData) {
         // Para PUT, enviamos el objeto completo para evitar errores de validación en backend
         await updateGoal(initialData.id, {
            ...initialData,
            ...formValues,
            // Aseguramos enviar usuarioId y otros campos que el backend podría requerir
            usuarioId: initialData.usuarioId,
            montoActual: initialData.montoActual,
            estado: initialData.estado
         });
      } else {
         await createGoal(formValues);
      }
      
      onSuccess();
      onClose();
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
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Meta' : 'Nueva Meta Financiera'}</h2>
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
                type="text"
                required
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 rounded-xl text-lg font-bold text-gray-900 transition-all outline-none"
              />
            </div>
            {montoObjetivo !== '' && (
                <p className="text-xs text-gray-400 mt-1 text-right">
                    Sin formato: {montoObjetivo}
                </p>
            )}
          </div>

           {/* Fecha Objetivo */}
           <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Objetivo</label>
              {montoObjetivo && fechaObjetivo && (
                <button
                  type="button"
                  onClick={handleAnalyzeGoal}
                  disabled={isAnalyzing}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                    {isAnalyzing ? (
                        <span className="animate-pulse">Calculando viabilidad...</span>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            Analizar viabilidad
                        </>
                    )}
                </button>
              )}
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                required
                value={fechaObjetivo}
                onChange={(e) => setFechaObjetivo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-500 rounded-xl outline-none transition-all"
              />
            </div>

            {/* AI Result */}
            {analysisResult && (
                <div className={`mt-3 p-3 text-sm rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2 ${
                    analysisResult.severity === 'danger' ? 'bg-red-50 text-red-700' :
                    analysisResult.severity === 'warning' ? 'bg-amber-50 text-amber-700' :
                    analysisResult.severity === 'success' ? 'bg-green-50 text-green-700' :
                    'bg-blue-50 text-blue-700'
                }`}>
                    <Bot size={18} className="mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium">Análisis de IA:</p>
                        <p>{analysisResult.message}</p>
                    </div>
                </div>
            )}
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
