import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../shared/components/ui/Sidebar';
import { MobileNavbar } from '../shared/components/ui/MobileNavbar';
import { Search, Settings, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKBar } from 'kbar';

export const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullName || 'Usuario';
  const navigate = useNavigate();
  const location = useLocation();
  const { query } = useKBar();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex transition-colors duration-300">
      {/* Sidebar fijo - Desktop */}
      <Sidebar />
      
      {/* Navbar fijo - Mobile */}
      <MobileNavbar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-52 flex flex-col min-w-0 pb-20 md:pb-0">
        
        {/* Header Superior */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md transition-colors duration-300">
          <div className="flex-1 max-w-xl flex items-center gap-2">
             <div onClick={query.toggle} className="cursor-pointer group flex-1 relative">
               <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" />
               <div className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-500 dark:text-gray-300 flex items-center justify-between text-sm group-hover:bg-white dark:group-hover:bg-slate-600 transition-all">
                  <span>Buscar o ejecutar comandos...</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-500 rounded">Ctrl</kbd> 
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-500 rounded">K</kbd>
                  </div>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="Configuración"
            >
              <Settings size={20} />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2" />
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{userName}</p>
               </div>
               <img 
                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
                 alt="User" 
                 className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer"
               />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
