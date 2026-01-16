import { useState, useEffect } from 'react';
import { useFinancialContext } from '../features/financial-context/hooks/useFinancialContext';
import { User, Settings, Save, CheckCircle } from 'lucide-react';
import type { IncomeType } from '../core/types/domain';

export const SettingsPage = () => {
    const userName = localStorage.getItem('userName') || 'Usuario';
    const userEmail = localStorage.getItem('userEmail') || 'usuario@example.com';

    const { context, loading, saveContext } = useFinancialContext();

    const [savingsRate, setSavingsRate] = useState<number>(20);
    const [incomeType, setIncomeType] = useState<IncomeType>('MONTHLY');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (context) {
            setSavingsRate(context.porcentajeAhorroDeseado);
            setIncomeType(context.tipoIngreso);
        }
    }, [context]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await saveContext({
                tipoIngreso: incomeType,
                tieneIngresoVariable: false, // Default for now
                porcentajeAhorroDeseado: savingsRate,
                periodoAnalisis: 'MONTHLY'
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading && !context) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-500 mt-1">Administra tu perfil y preferencias financieras.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card (Read Only) */}
                <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                            <User size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-500 mb-6">{userEmail}</p>
                        
                        <div className="w-full pt-6 border-t border-gray-100">
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Cuenta</div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle size={12} /> Activa
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Context Form */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-gray-400" />
                        Preferencias Financieras
                    </h3>

                    <form onSubmit={handleSave} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ¿Cómo recibes tus ingresos?
                            </label>
                            <select
                                value={incomeType}
                                onChange={(e) => setIncomeType(e.target.value as IncomeType)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="MONTHLY">Mensual (Salario estándar)</option>
                                <option value="BIWEEKLY">Quincenal</option>
                                <option value="WEEKLY">Semanal</option>
                                <option value="PROJECT_BASED">Por Proyecto (Freelance)</option>
                                <option value="VARIABLE">Variable / Irregular</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">Esto nos ayuda a organizar tus reportes.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta de Ahorro Mensual (%)
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        step="1"
                                        value={savingsRate}
                                        onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    />
                                    <div className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-lg min-w-[4rem] text-center">
                                        {savingsRate}%
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    La regla estándar sugiere 20%. Ajusta según tus posibilidades.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className={`text-sm text-green-600 transition-opacity ${success ? 'opacity-100' : 'opacity-0'}`}>
                                ¡Cambios guardados correctamente!
                            </span>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
