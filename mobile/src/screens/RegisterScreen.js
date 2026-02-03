import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { authService } from '../features/auth/services/authService';

// Iconos SVG
const EmailIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#B8B8B8"/>
  </Svg>
);

const UserIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#B8B8B8"/>
  </Svg>
);

const LockIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" fill="#B8B8B8"/>
  </Svg>
);

const EyeIcon = ({ visible }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {visible ? (
      <Path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#B8B8B8"/>
    ) : (
      <Path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3M7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8Z" fill="#B8B8B8"/>
    )}
  </Svg>
);

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#EF4444', width: '33%' };
    if (password.length < 10) return { label: 'Medium', color: '#F59E0B', width: '66%' };
    return { label: 'Strong', color: '#10B981', width: '100%' };
  };

  const handleRegister = async () => {
    if (!email || !fullName || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.register(email, fullName, password);
      Alert.alert('Éxito', 'Registro exitoso. Bienvenido!');
      // Navegar a la pantalla principal
      // navigation.replace('Home');
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo completar el registro. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000002', '#00000000', '#1d0746']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {/* Partículas */}
      <View style={[styles.particle, { top: '15%', left: '10%', width: 8, height: 8, backgroundColor: '#B379DF' }]} />
      <View style={[styles.particle, { top: '30%', left: '80%', width: 10, height: 10, backgroundColor: '#360060' }]} />
      <View style={[styles.particle, { top: '50%', left: '20%', width: 6, height: 6, backgroundColor: '#CC5854' }]} />
      <View style={[styles.particle, { top: '70%', left: '75%', width: 9, height: 9, backgroundColor: '#C45647' }]} />
      <View style={[styles.particle, { top: '85%', left: '40%', width: 7, height: 7, backgroundColor: '#D25A63' }]} />

      {/* Card con glassmorphism */}
      <View style={styles.cardContainer}>
        {/* Imagen del monopoly encima del card */}
        <Image 
          source={require('../../assets/monopoly-registrer .png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        
        <BlurView intensity={30} tint="dark" style={styles.blurCard}>
          {/* Capa 1: Gradiente B379DF a 360060 */}
          <LinearGradient
            colors={['#B379DF02', '#36006002']}
            style={styles.glassCard}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          
          {/* Capa 2: Gradiente B379DF - CC5854 - B379DF */}
          <LinearGradient
            colors={['rgba(179, 121, 223, 0.1)', 'rgba(204, 88, 84, 0)', 'rgba(179, 121, 223, 0)']}
            style={styles.overlayGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          {/* Capa 3: Gradiente C45647 a D25A63 */}
          <LinearGradient
            colors={['rgba(196, 86, 71, 0.1)', 'rgba(210, 90, 99, 0)']}
            style={styles.overlayGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          />

          {/* Contenido del formulario */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Regístrate</Text>
                <Text style={styles.subtitle}>Crea tu cuenta y empieza a controlar tus finanzas</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <EmailIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Full Name Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <UserIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="@yourname"
                    placeholderTextColor="#888"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <LockIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <EyeIcon visible={showPassword} />
                  </TouchableOpacity>
                </View>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBarBackground}>
                      <View style={[styles.strengthBar, { width: passwordStrength.width, backgroundColor: passwordStrength.color }]} />
                    </View>
                    <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                      {passwordStrength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.registerButtonText}>registrar</Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.6,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  illustration: {
    width: 320,
    height: 350,
    position: 'absolute',
    bottom: '60%',
    left: 100,
    zIndex: 10,
  },
  blurCard: {
    width: '100%',
    height: '80%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassCard: {
    flex: 1,
  },
  overlayGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  formContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 140,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#B8B8B8',
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 30, 50, 0.6)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  eyeButton: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#B8B8B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});
