import { Outlet } from 'react-router-dom';
import SplitText from '../shared/components/ui/SplitText';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Lado Izquierdo: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
           {/* Logo Móvil */}
           <div className="flex items-center gap-2 lg:hidden mb-8">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-3 h-3 bg-white transform -rotate-45" />
              </div>
              <span className="font-bold text-xl text-primary-900 tracking-tight">Finanzas</span>
           </div>
           
           <Outlet />
        </div>
      </div>

      {/* Lado Derecho: Banner visual (Oculto en móvil) */}
      <div 
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-login.jpg')" }}
      >
        {/* Overlay oscuro para mejorar contraste si la imagen es muy clara */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        {/* Texto Animado */}
        <div className="relative z-10 text-center p-12 max-w-lg text-white space-y-6">
           
           <div className="text-4xl font-bold tracking-tight drop-shadow-lg">
             <SplitText
                text="Bienvenido a tu control financiero."
                delay={50}
                duration={1}
                tag="h2"
                textAlign="center"
             />
           </div>

           <div className="text-white/90 text-lg drop-shadow-md">
             <SplitText
                text="Gestiona tus ingresos, gastos y metas en un solo lugar. Simple, gratuito y de código abierto."
                delay={80} // Un poco más lento que el título
                duration={1.2}
                tag="p"
                textAlign="center"
             />
           </div>
        </div>
      </div>
    </div>
  );
};
