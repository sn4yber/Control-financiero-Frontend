import { Outlet } from 'react-router-dom';
import { Sidebar } from '../shared/components/ui/Sidebar';
import { Bell, Search, Settings } from 'lucide-react';

export const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullName || 'Usuario';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-52 flex flex-col min-w-0">
        
        {/* Header Superior */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex-1 max-w-xl">
             {/* Espacio para breadcrumbs o título dinámico si se requiere luego */}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative">
               <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
              <Settings size={20} />
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2" />
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Plan Gratuito</p>
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
