import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../shared/components/ui/Sidebar';
import { Search, Settings } from 'lucide-react';

export const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullName || 'Usuario';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex transition-colors duration-300">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-52 flex flex-col min-w-0">
        
        {/* Header Superior */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-8 flex items-center justify-between sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md transition-colors duration-300">
          <div className="flex-1 max-w-xl">
             <form onSubmit={handleSearch} className="relative group">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar movimientos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                />
             </form>
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
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
