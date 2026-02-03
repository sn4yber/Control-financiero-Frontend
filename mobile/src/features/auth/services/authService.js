import { apiClient } from '../../../core/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login
  login: async (usernameOrEmail, password) => {
    try {
      // Limpiar espacios en blanco y enviar el username/email en ambos campos
      const cleanUsername = usernameOrEmail.trim();
      const cleanPassword = password.trim();
      
      const payload = {
        username: cleanUsername,
        email: cleanUsername,
        password: cleanPassword,
      };
      
      console.log('Login attempt with:', payload);
      const response = await apiClient.post('/auth/login', payload);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        
        // Guardar datos del usuario (vienen en el nivel superior de la respuesta)
        const userData = {
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      console.error('Full error:', error);
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Register
  register: async (email, name, password) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrarse' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Get current user from storage
  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};
