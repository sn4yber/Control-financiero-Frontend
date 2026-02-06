import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (imageUri) => {
    try {
      if (imageUri) {
        await AsyncStorage.setItem('profileImage', imageUri);
        setProfileImage(imageUri);
      } else {
        await AsyncStorage.removeItem('profileImage');
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  return { profileImage, loading, updateProfileImage, refresh: loadProfileImage };
};
