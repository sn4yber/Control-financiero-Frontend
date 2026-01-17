import { Home, ArrowRightLeft, Target, PieChart, FileText, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const menuItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: ArrowRightLeft, label: 'Mov.', path: '/transactions' },
  { icon: Target, label: 'Metas', path: '/goals' },
  { icon: PieChart, label: 'Presup.', path: '/budgets' },
  { icon: FileText, label: 'Rep.', path: '/reports' },
];

export const MobileNavbar = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 pb-safe z-50 flex justify-around px-2 py-3 shadow-lg-up">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[3.5rem]',
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            )
          }
        >
          <item.icon size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
      <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[3.5rem]',
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            )
          }
      >
          <Menu size={24} strokeWidth={2} />
           <span className="text-[10px] font-medium">Menú</span>
      </NavLink>
    </nav>
  );
};
