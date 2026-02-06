import { apiClient } from '../../../core/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const profileService = {
  // Obtener perfil del usuario actual
  getProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error.response?.data || { message: 'Error al obtener el perfil' };
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || { message: 'Error al actualizar el perfil' };
    }
  },

  // Subir foto de perfil
  uploadProfileImage: async (imageUri) => {
    try {
      // Convertir imagen a base64
      const base64Image = await fetch(imageUri)
        .then(res => res.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));

      const response = await apiClient.post('/user/profile/image', {
        image: base64Image
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error.response?.data || { message: 'Error al subir la imagen' };
    }
  },

  // Guardar imagen localmente (fallback si el backend no está disponible)
  saveImageLocally: async (imageUri) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const key = `profileImage_${user.id}`;
        await AsyncStorage.setItem(key, imageUri);
      }
    } catch (error) {
      console.error('Error saving image locally:', error);
    }
  },

  // Obtener imagen local
  getImageLocally: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const key = `profileImage_${user.id}`;
        return await AsyncStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Error getting image locally:', error);
      return null;
    }
  },

  // Guardar datos de perfil localmente (por usuario)
  saveProfileLocally: async (profileData) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const key = `profileData_${user.id}`;
        await AsyncStorage.setItem(key, JSON.stringify(profileData));
      }
    } catch (error) {
      console.error('Error saving profile locally:', error);
    }
  },

  // Obtener datos de perfil locales
  getProfileLocally: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const key = `profileData_${user.id}`;
        const profileDataStr = await AsyncStorage.getItem(key);
        return profileDataStr ? JSON.parse(profileDataStr) : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting profile locally:', error);
      return null;
    }
  }
};
