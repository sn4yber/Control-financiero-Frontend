import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { profileService } from '../features/auth/services/profileService';

export const SettingsPage = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workplace: '',
    position: '',
    bio: '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Cargar datos del usuario desde AsyncStorage
      const userDataStr = await AsyncStorage.getItem('userData');
      
      // Cargar datos de perfil específicos del usuario
      const profileData = await profileService.getProfileLocally();
      const savedImage = await profileService.getImageLocally();

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setFormData(prev => ({
          ...prev,
          fullName: userData.fullName || '',
          email: userData.email || '',
        }));
      }

      if (profileData) {
        setFormData(prev => ({ ...prev, ...profileData }));
      }

      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const pickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto de perfil');
      return;
    }

    // Seleccionar imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await profileService.saveImageLocally(imageUri);
    }
  };

  const takePhoto = async () => {
    // Pedir permisos de cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara para tomar una foto');
      return;
    }

    // Tomar foto
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await profileService.saveImageLocally(imageUri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Foto de Perfil',
      'Elige una opción',
      [
        { text: 'Tomar Foto', onPress: takePhoto },
        { text: 'Elegir de Galería', onPress: pickImage },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleSave = async () => {
    try {
      // Guardar datos de perfil específicos del usuario
      await profileService.saveProfileLocally(formData);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Solo limpiar datos de sesión (mantener profileData y profileImage)
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('userData');
              
              // Navegar al Welcome screen y resetear el stack
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                })
              );
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/profile.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={8}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
          <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
              <Text style={styles.title}>Configuración</Text>
              <Text style={styles.subtitle}>Personaliza tu perfil</Text>
            </View>

            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity onPress={showImageOptions} style={styles.imageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="person" size={60} color="#888" />
                  </View>
                )}
                <View style={styles.cameraIconContainer}>
                  <LinearGradient
                    colors={['#B379DF', '#360060']}
                    style={styles.cameraIcon}
                  >
                    <Ionicons name="camera" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
              <Text style={styles.imageHint}>Toca para cambiar foto</Text>
            </View>

            {/* Personal Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={24} color="#B379DF" />
                <Text style={styles.sectionTitle}>Información Personal</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre Completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre"
                  placeholderTextColor="#666"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#666"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+57 300 123 4567"
                  placeholderTextColor="#666"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Work Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="briefcase" size={24} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Información Laboral</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Empresa / Lugar de Trabajo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="¿Dónde trabajas?"
                  placeholderTextColor="#666"
                  value={formData.workplace}
                  onChangeText={(text) => setFormData({ ...formData, workplace: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cargo / Posición</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu puesto de trabajo"
                  placeholderTextColor="#666"
                  value={formData.position}
                  onChangeText={(text) => setFormData({ ...formData, position: text })}
                />
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={24} color="#2196F3" />
                <Text style={styles.sectionTitle}>Acerca de Ti</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Biografía</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Cuéntanos sobre ti..."
                  placeholderTextColor="#666"
                  value={formData.bio}
                  onChangeText={(text) => setFormData({ ...formData, bio: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.buttonGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out" size={20} color="#F44336" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </BlurView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: { flex: 1, backgroundColor: '#000000' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  blurOverlay: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#B379DF', marginTop: 4, fontWeight: '600' },
  
  profileImageSection: { alignItems: 'center', marginBottom: 32 },
  imageContainer: { position: 'relative', marginBottom: 12 },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#B379DF',
  },
  placeholderImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 4,
    borderColor: '#B379DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  imageHint: {
    fontSize: 13,
    color: '#BBB',
    fontWeight: '600',
  },

  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  inputContainer: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BBB',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(244, 67, 54, 0.4)',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F44336',
  },

  bottomPadding: { height: 40 },
});
