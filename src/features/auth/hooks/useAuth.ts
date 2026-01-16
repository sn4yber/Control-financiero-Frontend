import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (identifier: number | string) => {
    try {
      setLoading(true);
      setError(null);
      let user;

      // Según la documentación de la API entregada:
      // Solo existen endpoints: POST /usuarios y GET /usuarios/{id}
      // NO hay endpoint para buscar por email/username.
      
      if (typeof identifier === 'string') {
          // Intentamos convertir a numero por si el usuario metió "123" como texto
          const parsedId = parseInt(identifier);
          if (!isNaN(parsedId)) {
               user = await authService.getById(parsedId);
          } else {
             // Si es texto real (ej: "pepito@mail.com"), fallamos rápido.
             throw new Error('La API actual solo soporta ingreso por ID Numérico. Por favor usa el ID que obtuviste al registrarte.');
          }
      } else {
          user = await authService.getById(identifier);
      }
      
      // Guardamos sesión simple
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/'); // Redirigir al dashboard
    } catch (err: any) {
      const msg = err.message || 'Error desconocido';
      if (msg.includes('solo soporta ingreso por ID')) {
         setError(msg);
      } else {
         setError('No pudimos encontrar un usuario con ese ID. Verifica tus datos.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Definimos el tipo localmente o lo importamos si se usa en service
  interface RegisterData {
    username: string;
    email: string;
    fullName: string;
    password?: string;
  }

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.register(data);
      
      // Auto-login al registrar
      localStorage.setItem('userId', newUser.id.toString());
      localStorage.setItem('user', JSON.stringify(newUser));
      
      navigate('/');
    } catch (err) {
      setError('Error al registrar usuario. Intenta con otro email/username.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Aseguramos borrar token si existiera
    navigate('/login');
  };

  return { login, register, logout, loading, error };
};
