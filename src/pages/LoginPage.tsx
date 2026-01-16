import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Link } from 'react-router-dom';
import { User, Lock, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviamos siempre como 'username' ya que el backend probablemente 
    // use este campo para buscar por usuario O email.
    login({ 
      username: usernameInput,
      password: passwordInput 
    });
  };

  return (
    <>
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="mt-2 text-gray-500">
            Bienvenido de nuevo. Ingresas tus credenciales.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
               Usuario / Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input
                id="username"
                name="username"
                type="text" 
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
               Contraseña
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={20} />
              </div>
              <input
                id="password"
                name="password"
                type="password" 
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
            </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
             <Loader2 size={20} className="animate-spin mr-2" />
          ) : 'Ingresar'}
        </button>

        <div className="mt-6 text-center text-sm">
             <span className="text-gray-500">¿No tienes cuenta? </span>
             <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                 Regístrate gratis
             </Link>
        </div>
      </form>
    </>
  );
};
