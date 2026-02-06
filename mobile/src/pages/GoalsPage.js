import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Animated, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { useGoals } from '../features/goals/hooks/useGoals';
import { useDeleteGoal } from '../features/goals/hooks/useDeleteGoal';
import { CreateGoalModal } from '../features/goals/components/CreateGoalModal';
import { Swipeable } from 'react-native-gesture-handler';

// Iconos SVG
const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TrophyIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H4.5C3.83696 9 3.20107 9.26339 2.73223 9.73223C2.26339 10.2011 2 10.837 2 11.5C2 12.163 2.26339 12.7989 2.73223 13.2678C3.20107 13.7366 3.83696 14 4.5 14H6" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18 9H19.5C20.163 9 20.7989 9.26339 21.2678 9.73223C21.7366 10.2011 22 10.837 22 11.5C22 12.163 21.7366 12.7989 21.2678 13.2678C20.7989 13.7366 20.163 14 19.5 14H18" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 7C6 5.67392 6.52678 4.40215 7.46447 3.46447C8.40215 2.52678 9.67392 2 11 2H13C14.3261 2 15.5979 2.52678 16.5355 3.46447C17.4732 4.40215 18 5.67392 18 7V14C18 15.3261 17.4732 16.5979 16.5355 17.5355C15.5979 18.4732 14.3261 19 13 19H11C9.67392 19 8.40215 18.4732 7.46447 17.5355C6.52678 16.5979 6 15.3261 6 14V7Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 19V22M8 22H16" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EditIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TrashIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#888888" strokeWidth="2"/>
    <Path d="M12 6V12L16 14" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const GoalsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const { goals, loading, error, refetch } = useGoals('ACTIVE');
  const { deleteGoal, loading: deleting } = useDeleteGoal();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  const getDaysLeft = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Hoy';
    return `${diffDays} días`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': return '#10B981';
      default: return '#888888';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Alta';
      case 'MEDIUM': return 'Media';
      case 'LOW': return 'Baja';
      default: return priority;
    }
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedGoal(null);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Eliminar Meta',
      '¿Estás seguro de eliminar esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(id);
              refetch();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la meta');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX, goal) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(goal)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <EditIcon />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(goal.id)}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <TrashIcon />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGoalCard = (goal) => {
    const progress = calculateProgress(goal.montoActual, goal.montoObjetivo);
    const priorityColor = getPriorityColor(goal.prioridad);

    return (
      <Swipeable
        key={goal.id}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, goal)}
        overshootRight={false}
      >
        <View style={styles.goalCard}>
          <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(179, 121, 223, 0.05)', 'rgba(54, 0, 96, 0.05)']}
              style={styles.cardGradient}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.goalName}>{goal.nombre}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}20` }]}>
                    <Text style={[styles.priorityText, { color: priorityColor }]}>
                      {getPriorityLabel(goal.prioridad)}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>

              {/* Description */}
              {goal.descripcion && (
                <Text style={styles.goalDescription} numberOfLines={2}>
                  {goal.descripcion}
                </Text>
              )}

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={['#B379DF', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>

              {/* Amounts */}
              <View style={styles.amountsContainer}>
                <View>
                  <Text style={styles.amountLabel}>Actual</Text>
                  <Text style={styles.amountValue}>{formatCurrency(goal.montoActual)}</Text>
                </View>
                <View style={styles.amountDivider} />
                <View>
                  <Text style={styles.amountLabel}>Objetivo</Text>
                  <Text style={styles.amountValue}>{formatCurrency(goal.montoObjetivo)}</Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.daysLeftContainer}>
                  <ClockIcon />
                  <Text style={styles.daysLeftText}>{getDaysLeft(goal.fechaObjetivo)}</Text>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </Swipeable>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/luna.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Metas Financieras</Text>
          <Text style={styles.headerSubtitle}>Define y alcanza tus objetivos</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <PlusIcon />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#B379DF" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error al cargar las metas</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <TrophyIcon />
            </View>
            <Text style={styles.emptyTitle}>No tienes metas activas</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera meta y comienza a ahorrar
            </Text>
            <TouchableOpacity style={styles.createFirstButton} onPress={handleCreate}>
              <Text style={styles.createFirstButtonText}>Crear mi primera meta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.goalsContainer}>
            {goals.map(renderGoalCard)}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <CreateGoalModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedGoal(null);
        }}
        onSuccess={() => {
          refetch();
        }}
        initialData={selectedGoal}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B379DF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B379DF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#EF4444',
    fontWeight: '600',
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
    marginBottom: 32,
  },
  createFirstButton: {
    backgroundColor: '#B379DF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 8,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(179, 121, 223, 0.2)',
    borderWidth: 3,
    borderColor: '#B379DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B379DF',
  },
  goalDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 11,
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  amountDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  daysLeftText: {
    fontSize: 13,
    color: '#888888',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 0,
  },
  actionButton: {
    width: 64,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
});
