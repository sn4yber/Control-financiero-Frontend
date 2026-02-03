import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const SuccessIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <Circle cx="40" cy="40" r="38" stroke="#FFD700" strokeWidth="4" fill="none" />
    <Path 
      d="M25 40L35 50L55 30" 
      stroke="#FFD700" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export const SuccessModal = ({ visible, onClose, message = '¡Inicio de sesión exitoso!' }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto cerrar después de 2 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['#2D1B4E', '#1A0F2E', '#0A0612']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <SuccessIcon />
            </View>
            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>Redirigiendo...</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 350,
  },
  modalContent: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#B8B8B8',
    textAlign: 'center',
  },
});
