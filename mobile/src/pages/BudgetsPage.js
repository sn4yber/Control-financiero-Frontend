import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useReports } from '../features/reports/hooks/useReports';
import { useFinancialContext } from '../features/financial-context/hooks/useFinancialContext';

// Iconos SVG
const CalculatorIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <Path d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 8H17M7 12H17M7 16H11" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DollarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#B379DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const BudgetsPage = () => {
  const { stats, loading, refetch } = useReports(new Date());
  const { financialContext } = useFinancialContext();
  const [simulationAmount, setSimulationAmount] = useState('');

  // Auto-refresh when page gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const income = stats?.income || 0;
  const baseAmount = simulationAmount ? parseFloat(simulationAmount) : income;

  // Regla 50/30/20
  const savingsPercentage = financialContext?.tasaAhorro ? (financialContext.tasaAhorro * 100) : 20;
  const remainingPercentage = 100 - savingsPercentage;
  
  const needsPercentage = Math.round(remainingPercentage * 0.625); // 50%
  const wantsPercentage = Math.round(remainingPercentage * 0.375); // 30%

  const suggestedNeeds = baseAmount * (needsPercentage / 100);
  const suggestedWants = baseAmount * (wantsPercentage / 100);
  const suggestedSavings = baseAmount * (savingsPercentage / 100);

  return (
   
      <ImageBackground
        source={require('../../assets/diablo.jpg')}
        style={styles.container}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.header}>
          <View>
          <Text style={styles.headerTitle}>Calculadora de Presupuesto</Text>
          <Text style={styles.headerSubtitle}>Planifica con la regla 50/30/20</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#B379DF" />
          </View>
        ) : (
          <>
            {/* Input Card */}
            <View style={styles.inputCard}>
              <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                <LinearGradient
                  colors={['rgba(179, 121, 223, 0.05)', 'rgba(54, 0, 96, 0.05)']}
                  style={styles.cardGradient}
                >
                  <Text style={styles.inputLabel}>
                    {income > 0 ? 'Tu Ingreso Mensual Registrado' : 'Ingresa tu ingreso mensual'}
                  </Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.dollarIconContainer}>
                      <DollarIcon />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={simulationAmount}
                      onChangeText={setSimulationAmount}
                      placeholder={income > 0 ? income.toString() : '2500000'}
                      placeholderTextColor="#666666"
                      keyboardType="numeric"
                    />
                  </View>
                </LinearGradient>
              </BlurView>
            </View>

            {baseAmount > 0 ? (
              <>
                {/* Info Card */}
                <View style={styles.infoCard}>
                  <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                    <LinearGradient
                      colors={['rgba(179, 121, 223, 0.1)', 'rgba(54, 0, 96, 0.1)']}
                      style={styles.cardGradient}
                    >
                      <Text style={styles.infoTitle}>Regla 50/30/20</Text>
                      <Text style={styles.infoText}>
                        • 50% para <Text style={styles.highlight}>Necesidades</Text>{'\n'}
                        • 30% para <Text style={styles.highlight}>Gustos</Text>{'\n'}
                        • 20% para <Text style={styles.highlight}>Ahorros</Text>
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </View>

                {/* Budget Cards */}
                <View style={styles.budgetCardsContainer}>
                  {/* Necesidades */}
                  <View style={styles.budgetCard}>
                    <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                      <LinearGradient
                        colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.05)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.budgetHeader}>
                          <Text style={styles.budgetPercentage}>{needsPercentage}%</Text>
                          <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Text style={[styles.badgeText, { color: '#3B82F6' }]}>Necesidades</Text>
                          </View>
                        </View>
                        <Text style={styles.budgetAmount}>{formatCurrency(suggestedNeeds)}</Text>
                        <Text style={styles.budgetDescription}>
                          Vivienda, comida, transporte, servicios básicos
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </View>

                  {/* Gustos */}
                  <View style={styles.budgetCard}>
                    <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                      <LinearGradient
                        colors={['rgba(236, 72, 153, 0.1)', 'rgba(219, 39, 119, 0.05)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.budgetHeader}>
                          <Text style={styles.budgetPercentage}>{wantsPercentage}%</Text>
                          <View style={[styles.badge, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                            <Text style={[styles.badgeText, { color: '#EC4899' }]}>Gustos</Text>
                          </View>
                        </View>
                        <Text style={styles.budgetAmount}>{formatCurrency(suggestedWants)}</Text>
                        <Text style={styles.budgetDescription}>
                          Entretenimiento, restaurantes, hobbies
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </View>

                  {/* Ahorros */}
                  <View style={styles.budgetCard}>
                    <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
                      <LinearGradient
                        colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)']}
                        style={styles.cardGradient}
                      >
                        <View style={styles.budgetHeader}>
                          <Text style={styles.budgetPercentage}>{savingsPercentage}%</Text>
                          <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Text style={[styles.badgeText, { color: '#10B981' }]}>Ahorros</Text>
                          </View>
                        </View>
                        <Text style={styles.budgetAmount}>{formatCurrency(suggestedSavings)}</Text>
                        <Text style={styles.budgetDescription}>
                          Fondo de emergencia, inversiones, metas
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <CalculatorIcon />
                </View>
                <Text style={styles.emptyTitle}>Calcula tu presupuesto</Text>
                <Text style={styles.emptySubtitle}>
                  Ingresa un monto para ver cómo distribuir tu dinero
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    opacity: 0.2,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  inputCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAAAAA',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingLeft: 16,
  },
  dollarIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 16,
    paddingRight: 16,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 24,
  },
  highlight: {
    color: '#B379DF',
    fontWeight: '700',
  },
  budgetCardsContainer: {
    gap: 16,
  },
  budgetCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetPercentage: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  budgetDescription: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(179, 121, 223, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
