import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useReports } from '../features/reports/hooks/useReports';
import { useMovements } from '../features/movements/hooks/useMovements';
import { useChartData } from '../features/reports/hooks/useChartData';
import { useFinancialContext } from '../features/financial-context/hooks/useFinancialContext';
import { useGoals } from '../features/goals/hooks/useGoals';
import { formatCurrency } from '../shared/utils/format';

const screenWidth = Dimensions.get('window').width;

export const ReportsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { stats, loading: statsLoading } = useReports(selectedMonth);
  const { movements, loading: movementsLoading } = useMovements();
  const { goals, loading: goalsLoading } = useGoals();
  
  // Filter movements by selected month for charts
  const monthFilteredMovements = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    return movements.filter(m => {
      const d = new Date(m.fechaMovimiento);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [movements, selectedMonth]);
  
  const { labels, incomeData, expenseData, maxVal } = useChartData(movements);
  const { financialContext } = useFinancialContext();

  const loading = statsLoading || movementsLoading || goalsLoading;

  const changeMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  // Calcular progreso de TODAS las metas
  const goalsProgress = useMemo(() => {
    if (!goals || goals.length === 0) {
      return { totalTarget: 0, totalCurrent: 0, percentage: 0 };
    }
    
    const totalTarget = goals.reduce((sum, goal) => sum + goal.montoObjetivo, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.montoActual, 0);
    const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) : 0;
    
    return { totalTarget, totalCurrent, percentage: Math.min(percentage, 1) };
  }, [goals]);

  return (
    <ImageBackground 
      source={require('../../assets/game.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={95} tint="dark" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(179, 121, 223, 0.15)', 'rgba(54, 0, 96, 0.25)', 'rgba(0, 0, 0, 0.85)']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Header with Month Selector */}
            <View style={styles.header}>
              <Text style={styles.title}>Reportes Financieros</Text>
              <View style={styles.monthSelector}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
                  <Ionicons name="chevron-back" size={24} color="#B379DF" />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                  {selectedMonth.toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
                  <Ionicons name="chevron-forward" size={24} color="#B379DF" />
                </TouchableOpacity>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando datos...</Text>
              </View>
            ) : (
              <>
                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                  <BlurView intensity={30} tint="dark" style={styles.summaryCard}>
                    <Ionicons name="trending-up" size={28} color="#4ADE80" />
                    <Text style={styles.summaryLabel}>Ingresos</Text>
                    <Text style={styles.summaryAmount}>{formatCurrency(stats?.income || 0)}</Text>
                  </BlurView>

                  <BlurView intensity={30} tint="dark" style={styles.summaryCard}>
                    <Ionicons name="trending-down" size={28} color="#F87171" />
                    <Text style={styles.summaryLabel}>Gastos</Text>
                    <Text style={styles.summaryAmount}>{formatCurrency(stats?.expenses || 0)}</Text>
                  </BlurView>

                  <BlurView intensity={30} tint="dark" style={styles.summaryCard}>
                    <Ionicons name="cash" size={28} color="#B379DF" />
                    <Text style={styles.summaryLabel}>Balance</Text>
                    <Text style={[styles.summaryAmount, { color: (stats?.balance || 0) >= 0 ? '#4ADE80' : '#F87171' }]}>
                      {formatCurrency(stats?.balance || 0)}
                    </Text>
                  </BlurView>
                </View>

                {/* Financial History Chart */}
                {movements.length > 0 && (
                  <BlurView intensity={30} tint="dark" style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Historial Financiero (Últimos 6 meses)</Text>
                    <LineChart
                      data={{
                        labels: labels,
                        datasets: [
                          {
                            data: incomeData,
                            color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                            strokeWidth: 3
                          },
                          {
                            data: expenseData,
                            color: (opacity = 1) => `rgba(248, 113, 113, ${opacity})`,
                            strokeWidth: 3
                          }
                        ],
                        legend: ['Ingresos', 'Gastos']
                      }}
                      width={screenWidth - 60}
                      height={220}
                      chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: 'rgba(0, 0, 0, 0.6)',
                        backgroundGradientTo: 'rgba(0, 0, 0, 0.6)',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: {
                          r: '4',
                          strokeWidth: '2',
                        },
                        propsForBackgroundLines: {
                          strokeDasharray: '',
                          stroke: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </BlurView>
                )}

                {/* Categories Breakdown */}
                {stats?.topCategories && stats.topCategories.length > 0 && (
                  <BlurView intensity={30} tint="dark" style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Gastos por Categoría</Text>
                    {stats.topCategories.slice(0, 5).map((cat, index) => {
                      const percentage = (stats?.expenses || 0) > 0 ? (cat.total / stats.expenses) * 100 : 0;
                      return (
                        <View key={index} style={styles.categoryItem}>
                          <View style={styles.categoryHeader}>
                            <Text style={styles.categoryName}>{cat.nombre}</Text>
                            <Text style={styles.categoryAmount}>{formatCurrency(cat.total)}</Text>
                          </View>
                          <View style={styles.progressBarContainer}>
                            <LinearGradient
                              colors={['#B379DF', '#360060']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[styles.progressBar, { width: `${percentage}%` }]}
                            />
                          </View>
                          <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
                        </View>
                      );
                    })}
                  </BlurView>
                )}

                {/* Goals Progress */}
                <BlurView intensity={30} tint="dark" style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Progreso de Metas</Text>
                  {goals.length === 0 ? (
                    <View style={styles.emptyGoalsContainer}>
                      <Text style={styles.emptyGoalsText}>No hay metas registradas</Text>
                      <Text style={styles.emptyGoalsSubtext}>Ve a la sección de Metas para crear una</Text>
                    </View>
                  ) : (
                    <View style={styles.savingsContainer}>
                      {/* Círculo de progreso personalizado */}
                      <View style={styles.progressCircleContainer}>
                        <Svg width="180" height="180" viewBox="0 0 180 180">
                          {/* Círculo de fondo (100% de todas las metas) - gris */}
                          <Circle
                            cx="90"
                            cy="90"
                            r="70"
                            stroke="#333333"
                            strokeWidth="20"
                            fill="none"
                          />
                          {/* Círculo de progreso (completado) - verde */}
                          <Circle
                            cx="90"
                            cy="90"
                            r="70"
                            stroke="#4ADE80"
                            strokeWidth="20"
                            fill="none"
                            strokeDasharray={`${goalsProgress.percentage * 439.8} 439.8`}
                            strokeLinecap="round"
                            rotation="-90"
                            origin="90, 90"
                          />
                        </Svg>
                        <View style={styles.progressTextContainer}>
                          <Text style={styles.progressPercentageText}>
                            {(goalsProgress.percentage * 100).toFixed(1)}%
                          </Text>
                          <Text style={styles.progressLabelText}>Completado</Text>
                        </View>
                      </View>
                      <View style={styles.savingsInfo}>
                        <View style={styles.savingsLegendItem}>
                          <View style={[styles.legendDot, { backgroundColor: '#4ADE80' }]} />
                          <Text style={styles.savingsLabel}>Progreso: {formatCurrency(goalsProgress.totalCurrent)}</Text>
                        </View>
                        <View style={styles.savingsLegendItem}>
                          <View style={[styles.legendDot, { backgroundColor: '#333333' }]} />
                          <Text style={styles.savingsLabel}>Meta Total: {formatCurrency(goalsProgress.totalTarget)}</Text>
                        </View>
                        <View style={styles.savingsLegendItem}>
                          <Text style={styles.goalsCountText}>Total de metas: {goals.length}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </BlurView>

                <View style={styles.bottomPadding} />
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  blurContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    minWidth: 200,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#888888',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#BBB',
    fontWeight: '700',
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chartCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B379DF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
  },
  savingsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  progressCircleContainer: {
    position: 'relative',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentageText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4ADE80',
  },
  progressLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BBB',
    marginTop: 4,
  },
  savingsInfo: {
    marginTop: 24,
    gap: 12,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  savingsLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emptyGoalsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyGoalsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyGoalsSubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
  goalsCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    fontStyle: 'italic',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  savingsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});
