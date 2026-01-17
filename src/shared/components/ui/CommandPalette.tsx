
import { 
  KBarPortal, 
  KBarPositioner, 
  KBarAnimator, 
  KBarSearch, 
  KBarResults,
  useMatches,
  useRegisterActions
} from 'kbar';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Target, 
  Settings, 
  PlusCircle, 
  LogOut 
} from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';

const RenderResults = () => {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
            {item}
          </div>
        ) : (
          <div
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4 ${
              active 
               ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600' 
               : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200'
            }`}
          >
             {item.icon && <span className={`${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{item.icon}</span>}
             <div className="flex flex-col">
                <span className="font-medium text-sm">{item.name}</span>
                {item.subtitle && <span className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</span>}
             </div>
             {item.shortcut?.length && (
               <div className="ml-auto flex gap-1">
                 {item.shortcut.map((sc) => (
                   <kbd key={sc} className="px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 shadow-sm">
                     {sc}
                   </kbd>
                 ))}
               </div>
             )}
          </div>
        )
      }
    />
  );
};

export const CommandPalette = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Assuming useAuth exists and has logout

    const actions = useMemo(() => [
        {
            id: 'home',
            name: 'Ir al Inicio',
            shortcut: ['g', 'h'],
            keywords: 'home dashboard inicio resumen',
            perform: () => navigate('/'),
            icon: <Home size={18} />,
            section: 'Navegación'
        },
        {
            id: 'transactions',
            name: 'Ver Movimientos',
            shortcut: ['g', 't'],
            keywords: 'transactions movimientos gastos ingresos historial',
            perform: () => navigate('/transactions'),
            icon: <CreditCard size={18} />,
            section: 'Navegación'
        },
        {
            id: 'goals',
            name: 'Mis Metas',
            shortcut: ['g', 'm'],
            keywords: 'goals metas objetivos ahorro',
            perform: () => navigate('/goals'),
            icon: <Target size={18} />,
            section: 'Navegación'
        },
        {
            id: 'reports',
            name: 'Reportes Financieros',
            shortcut: ['g', 'r'],
            keywords: 'reports reportes graficos estadisticas',
            perform: () => navigate('/reports'),
            icon: <PieChart size={18} />,
            section: 'Navegación'
        },
        {
            id: 'settings',
            name: 'Configuración',
            shortcut: ['g', 's'],
            keywords: 'settings ajuste configuracion perfil',
            perform: () => navigate('/settings'),
            icon: <Settings size={18} />,
            section: 'Ajustes'
        },
        {
            id: 'new-transaction',
            name: 'Nueva Transacción',
            shortcut: ['n', 't'],
            keywords: 'new nuevo crear gasto ingreso',
            perform: () => {
                navigate('/transactions');
                // Trigger modal opening logic if possible, or just navigate
            },
            icon: <PlusCircle size={18} />,
            section: 'Acciones Rápidas'
        },
        {
            id: 'logout',
            name: 'Cerrar Sesión',
            keywords: 'logout salir cerrar sesion',
            perform: () => logout(),
            icon: <LogOut size={18} />,
            section: 'Cuenta'
        }
    ], [navigate, logout]);

    useRegisterActions(actions);

    return (
        <KBarPortal>
          <KBarPositioner className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm p-4 flex items-start justify-center pt-[15vh]">
            <KBarAnimator className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5 dark:ring-gray-100/10">
              <KBarSearch className="w-full px-4 py-4 text-gray-800 dark:text-gray-100 bg-transparent border-b border-gray-100 dark:border-gray-800 outline-none text-lg placeholder:text-gray-400 font-medium" placeholder="¿Qué quieres hacer? (Escribe para buscar...)" />
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                <RenderResults />
              </div>
              <div className="h-9 border-t border-gray-100 dark:border-gray-800 flex items-center px-4 bg-gray-50 dark:bg-gray-800/50">
                 <span className="text-[10px] text-gray-400 font-medium flex gap-2">
                    <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">↑</kbd> <kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">↓</kbd> navegar</span>
                    <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">↵</kbd> seleccionar</span>
                    <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 px-1 rounded">esc</kbd> cerrar</span>
                 </span>
              </div>
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
    )
}
