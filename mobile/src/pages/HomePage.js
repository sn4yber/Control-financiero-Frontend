import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFinancialSummary } from '../features/financial-context/hooks/useFinancialSummary';
import { useGoals } from '../features/goals/hooks/useGoals';
import { useMovements } from '../features/movements/hooks/useMovements';
import { profileService } from '../features/auth/services/profileService';
import Svg, { Circle, Path } from 'react-native-svg';

export const HomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('Usuario');
  const [profileImage, setProfileImage] = useState(null);
  const { income, expense, balance, loading: loadingSummary } = useFinancialSummary();
  const { goals, loading: loadingGoals, refetch: refetchGoals } = useGoals();
  const { movements, loading: loadingMovements, refetch: refetchMovements } = useMovements();
  
  // useRef para mantener referencias estables
  const refetchMovementsRef = useRef(refetchMovements);
  const refetchGoalsRef = useRef(refetchGoals);
  
  useEffect(() => {
    refetchMovementsRef.current = refetchMovements;
    refetchGoalsRef.current = refetchGoals;
  }, [refetchMovements, refetchGoals]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        const savedImage = await profileService.getImageLocally();
        
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserName(userData.fullName || userData.username || 'Usuario');
        }
        
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Recargar todos los datos cuando se vuelve a la pantalla
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 HomePage focused - Refreshing data...');
      const refreshData = async () => {
        try {
          // Recargar imagen de perfil específica del usuario
          const savedImage = await profileService.getImageLocally();
          setProfileImage(savedImage);
          
          // Refrescar datos financieros usando refs
          if (refetchMovementsRef.current) {
            refetchMovementsRef.current();
          }
          if (refetchGoalsRef.current) {
            refetchGoalsRef.current();
          }
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      };
      refreshData();
    }, []) // Array vacío - solo ejecutar cuando la pantalla gana foco
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtener transacciones recientes
  const recentMovements = movements.slice(0, 5);

  // Calcular progreso de metas
  const firstGoal = goals[0];
  const goalProgress = firstGoal ? (firstGoal.montoActual / firstGoal.montoObjetivo) * 100 : 0;

  // Logs para debug
  console.log('🏠 HomePage - Loading states:', { 
    loadingSummary, 
    loadingGoals, 
    loadingMovements,
    movementsCount: movements.length,
    goalsCount: goals.length
  });

  if (loadingSummary || loadingGoals || loadingMovements) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/fondo-home.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={8}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFDF88" />
              <Text style={styles.loadingText}>Cargando dashboard...</Text>
            </View>
          </BlurView>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/fondo-home.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={8}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity 
                    style={styles.avatar}
                  onPress={() => navigation.navigate('Settings')}
                >
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                  ) : (
                    <Svg width="40" height="40" viewBox="0 0 40 40">
                      <Circle cx="20" cy="20" r="20" fill="#FFDF88" />
                      <Circle cx="20" cy="16" r="8" fill="#2D1B4E" />
                      <Path d="M8 32 Q8 22 20 22 Q32 22 32 32" fill="#2D1B4E" />
                    </Svg>
                  )}
                </TouchableOpacity>
                <View>
                  <Text style={styles.greeting}>¡{getGreeting()}!</Text>
                  <Text style={styles.subtitle}>Estado de hoy</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#FFDF88"/>
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Overview Title */}
            <View style={styles.overviewContainer}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <Image
                source={require('../../assets/cupheads.png')}
                style={styles.cupheadsImage}
                resizeMode="contain"
              />
            </View>

            {/* Balance Card Principal - Fondo Negro con Borde Púrpura */}
            <View style={styles.mainCard}>
              <View style={styles.cardGradient}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <Svg width="24" height="24" viewBox="0 0 24 24">
                      <Path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#8B5CF6" />
                    </Svg>
                  </View>
                  <Text style={styles.cardLabel}>Balance Total</Text>
                </View>
                <Text style={styles.mainAmount}>{formatCurrency(balance)}</Text>
                
                {/* Mini gráfico de barras */}
                <View style={styles.miniChart}>
                  {[0.6, 0.8, 0.4, 1, 0.7, 0.5, 0.9, 0.6].map((height, index) => (
                    <View
                      key={index}
                      style={[
                        styles.chartBar,
                        { height: `${height * 100}%`, backgroundColor: index === 3 ? '#8B5CF6' : 'rgba(139, 92, 246, 0.3)' }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Tarjetas Ingresos y Gastos */}
            <View style={styles.cardRow}>
              {/* Card Ingresos - Fondo Negro con Borde Verde */}
              <View style={styles.smallCard}>
                <View style={styles.smallCardGradient}>
                  <View style={[styles.dashedBorder, styles.dashedBorderGreen]} />
                  <View style={styles.smallCardHeader}>
                    <Svg width="20" height="20" viewBox="0 0 24 24">
                      <Path d="M7 14L12 9L17 14" stroke="#10B981" strokeWidth="2" fill="none" />
                    </Svg>
                    <Text style={styles.smallCardLabel}>Ingresos</Text>
                  </View>
                  <Text style={styles.smallAmount}>{formatCurrency(income)}</Text>
                  
                  {/* Curva decorativa */}
                  <Svg width="100%" height="60" style={styles.curveSvg}>
                    <Path d="M0 40 Q50 20 100 40 T200 40" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" fill="none" />
                  </Svg>
                </View>
              </View>

              {/* Card Gastos - Fondo Negro con Borde Rojo */}
              <View style={styles.smallCard}>
                <View style={styles.smallCardGradient}>
                  <View style={[styles.dashedBorder, styles.dashedBorderRed]} />
                  <View style={styles.smallCardHeader}>
                    <Svg width="20" height="20" viewBox="0 0 24 24">
                      <Path d="M17 10L12 15L7 10" stroke="#EF4444" strokeWidth="2" fill="none" />
                    </Svg>
                    <Text style={styles.smallCardLabel}>Gastos</Text>
                  </View>
                  <Text style={styles.smallAmount}>{formatCurrency(expense)}</Text>
                  
                  {/* Curva decorativa */}
                  <Svg width="100%" height="60" style={styles.curveSvg}>
                    <Path d="M0 20 Q50 40 100 20 T200 20" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" fill="none" />
                  </Svg>
                </View>
              </View>
            </View>

            {/* Sección de Metas */}
            {firstGoal && (
              <View style={styles.goalsSection}>
                <Text style={styles.sectionTitle}>Metas Financieras</Text>
                <TouchableOpacity style={styles.goalCard} onPress={() => navigation.navigate('Goals')}>
                  <View style={styles.goalInfo}>
                    <View style={styles.goalTextRow}>
                      <Svg width="20" height="20" viewBox="0 0 24 24">
                        <Circle cx="12" cy="12" r="10" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                        <Path d="M12 6V12L16 16" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                      </Svg>
                      <Text style={styles.goalLabel}>{firstGoal.nombre}</Text>
                    </View>
                    <Text style={styles.goalAmount}>{formatCurrency(firstGoal.montoActual)}</Text>
                    <Text style={styles.goalTarget}>de {formatCurrency(firstGoal.montoObjetivo)}</Text>
                  </View>
                  
                  {/* Gráfico circular de progreso */}
                  <View style={styles.progressCircle}>
                    <Svg width="120" height="120" viewBox="0 0 120 120">
                      <Circle cx="60" cy="60" r="50" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="12" fill="none" />
                      <Circle
                        cx="60" cy="60" r="50" stroke="#8B5CF6" strokeWidth="12" fill="none"
                        strokeDasharray={`${(goalProgress / 100) * 314} 314`}
                        strokeLinecap="round" transform="rotate(-90 60 60)"
                      />
                    </Svg>
                    <View style={styles.progressText}>
                      <Text style={styles.progressPercentage}>{Math.round(goalProgress)}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Transacciones Recientes */}
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionTitle}>Recientes</Text>
              {recentMovements.map((movement, index) => (
                <View key={movement.id || index} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Svg width="16" height="16" viewBox="0 0 24 24">
                      <Circle cx="12" cy="12" r="10" fill={movement.tipoMovimiento === 'INCOME' ? '#10B981' : '#EF4444'} />
                    </Svg>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{movement.descripcion}</Text>
                    <Text style={styles.transactionDate}>{new Date(movement.fechaMovimiento).toLocaleDateString('es-CO')}</Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    movement.tipoMovimiento === 'INCOME' ? styles.incomeAmount : styles.expenseAmount
                  ]}>
                    {movement.tipoMovimiento === 'INCOME' ? '+' : '-'}{formatCurrency(Math.abs(movement.monto))}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ height: 100 }} />
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', fontSize: 16, marginTop: 16, fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFDF88', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFDF88' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#B8B8B8', marginTop: 2 },
  notificationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.15)', justifyContent: 'center', alignItems: 'center' },
  overviewContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, position: 'relative' },
  overviewTitle: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  cupheadsImage: { width: 200, height: 160, position: 'absolute', right: -10, bottom: -50, zIndex: 10 },
  mainCard: { 
    borderRadius: 24, 
    marginBottom: 16, 
    overflow: 'hidden', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.6)'
  },
  cardGradient: { padding: 20, minHeight: 160 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(139, 92, 246, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cardLabel: { fontSize: 15, color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.5 },
  mainAmount: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', height: 40, gap: 4 },
  chartBar: { flex: 1, borderRadius: 4, minHeight: 12 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  smallCard: { 
    flex: 1, 
    borderRadius: 20, 
    overflow: 'hidden', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 2.84,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  smallCardGradient: { padding: 16, minHeight: 180, position: 'relative' },
  dashedBorder: { position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' },
  dashedBorderGreen: { borderColor: 'rgba(16, 185, 129, 0.6)' },
  dashedBorderRed: { borderColor: 'rgba(239, 68, 68, 0.6)' },
  smallCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  smallCardLabel: { fontSize: 13, color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.5 },
  smallAmount: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  curveSvg: { position: 'absolute', bottom: 8, left: 0 },
  goalsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  goalCard: { 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 20, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)'
  },
  goalInfo: { flex: 1 },
  goalTextRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  goalLabel: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  goalAmount: { fontSize: 24, fontWeight: '700', color: '#8B5CF6', marginBottom: 4 },
  goalTarget: { fontSize: 13, color: '#B8B8B8' },
  progressCircle: { position: 'relative', width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  progressText: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  progressPercentage: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  transactionsSection: { marginBottom: 24 },
  transactionItem: { 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionDescription: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  transactionDate: { fontSize: 12, color: '#B8B8B8' },
  transactionAmount: { fontSize: 16, fontWeight: '700' },
  incomeAmount: { color: '#10B981' },
  expenseAmount: { color: '#EF4444' },
});
