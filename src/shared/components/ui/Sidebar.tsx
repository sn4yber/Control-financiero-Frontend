import { Home, ArrowRightLeft, Target, PieChart, FileText, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../../features/auth/hooks/useAuth';

const menuItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: ArrowRightLeft, label: 'Movimientos', path: '/transactions' },
  { icon: Target, label: 'Metas', path: '/goals' },
  { icon: PieChart, label: 'Presupuestos', path: '/budgets' },
  { icon: FileText, label: 'Reportes', path: '/reports' },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  // Recuperar nombre de usuario del localStorage para mostrarlo
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <aside className="fixed left-0 top-0 h-screen w-52 bg-dark text-slate-300 flex flex-col border-r border-slate-800 z-50">
      {/* 1. User Profile Area */}
      <div className="h-24 flex items-center px-4 border-b border-slate-800/50">
        <button className="flex items-center gap-2 w-full p-2 rounded-xl hover:bg-white/5 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 group-hover:border-primary-500 transition-colors flex-shrink-0">
            <User size={20} className="text-slate-300 group-hover:text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.fullName || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">Ver perfil</p>
          </div>
        </button>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20 translate-x-1'
                  : 'hover:bg-white/5 hover:text-white hover:translate-x-1'
              )
            }
          >
            <item.icon size={20} className={clsx("stroke-[1.5]", { "text-white": true })} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 3. Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full p-2 text-red-400 hover:bg-red-900/10 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
