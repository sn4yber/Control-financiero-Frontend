import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }) => {
  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Background decorativo */}
      <View style={styles.decorativeBackground}>
        {/* Círculo principal azul/morado */}
        <View style={styles.mainCircle} />
        
        {/* Elementos decorativos */}
        <View style={[styles.decorElement, styles.star1]}>
          <Text style={styles.starText}>✦</Text>
        </View>
        <View style={[styles.decorElement, styles.star2]}>
          <Text style={styles.starText}>✦</Text>
        </View>
        <View style={[styles.decorElement, styles.heart]}>
          <Text style={styles.heartText}>♡</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.titleWhite}>Controla tu plata con</Text>
          <Text style={styles.titleYellow}>Metafy</Text>
        </View>

        {/* Imagen de la mascota */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/mascota-welcome.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Botón continuar */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <View style={styles.buttonCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  decorativeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mainCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: '#4A5FD9',
    top: height * 0.35,
    left: width * 0.1,
    opacity: 0.9,
  },
  decorElement: {
    position: 'absolute',
  },
  star1: {
    top: height * 0.4,
    left: width * 0.15,
  },
  star2: {
    bottom: height * 0.25,
    right: width * 0.15,
  },
  heart: {
    top: height * 0.5,
    right: width * 0.1,
  },
  starText: {
    fontSize: 24,
    color: '#8B9FFF',
    opacity: 0.6,
  },
  heartText: {
    fontSize: 28,
    color: '#8B9FFF',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleWhite: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleYellow: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F5C842',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  mascotImage: {
    width: width * 0.6,
    height: height * 0.4,
  },
  continueButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5C842',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F5C842',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrow: {
    fontSize: 32,
    color: '#1A1A1A',
    fontWeight: '600',
  },
});
