import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type LoginDTO } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginDTO) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      
      // Save session
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      navigate('/'); 
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
          setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      } else {
          setError('Error al iniciar sesión. Verifica tu conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
      try {
          setLoading(true);
          setError(null);
          const response = await authService.register(data);
           localStorage.setItem('token', response.token);
           if (response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
           }
          navigate('/');
      } catch (err: any) {
          console.error(err);
           if (err.response && err.response.status === 409) {
             setError('El nombre de usuario o email ya existe.');
           } else {
             setError('Error al registrar usuario.');
           }
      } finally {
          setLoading(false);
      }
  };

  const logout = () => {
      authService.logout();
      navigate('/login');
  };

  return { login, register, logout, loading, error };
};
