import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ImageBackground, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Animated, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useMovements } from '../features/movements/hooks/useMovements';
import { useDeleteMovement } from '../features/movements/hooks/useDeleteMovement';
import { CreateTransactionModal } from '../features/movements/components/CreateTransactionModal';
import { Swipeable } from 'react-native-gesture-handler';

export const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('EXPENSE');

  const { movements, loading, error, refetch } = useMovements({ tipo: filterType });
  const { deleteMovement } = useDeleteMovement();

  // Auto-refresh when page gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const filteredMovements = useMemo(() => {
    if (!searchQuery) return movements;
    const lowerQuery = searchQuery.toLowerCase();
    return movements.filter(m =>
      m.descripcion.toLowerCase().includes(lowerQuery) ||
      m.categoriaNombre?.toLowerCase().includes(lowerQuery) ||
      m.fuenteIngresoNombre?.toLowerCase().includes(lowerQuery) ||
      m.monto.toString().includes(lowerQuery)
    );
  }, [movements, searchQuery]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Movimiento',
      '¿Estás seguro de eliminar este movimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMovement(id);
              refetch();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el movimiento');
            }
          }
        }
      ]
    );
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const renderRightActions = (progress, dragX, movementId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(movementId)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/fondo-moviemientos.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={8}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A5D6A7" />
              <Text style={styles.loadingText}>Cargando movimientos...</Text>
            </View>
          </BlurView>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/fondo-moviemientos.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={8}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
            <View style={styles.contentContainer}>
              {/* Header */}
              <View style={styles.header}>
              <Text style={styles.title}>Movimientos</Text>
              <Text style={styles.subtitle}>gestiona tus movimientos financieros</Text>
            </View>

            {/* Imagen de Elder Kettle - circular */}
            <View style={styles.elderKettleContainer}>
              <Image
                source={require('../../assets/la taza2.png')}
                style={styles.elderKettleImage}
              />
            </View>

            {/* Quick Actions - 3 botones transparentes con liquid glass */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => openModal('INCOME')}
              >
                <Svg width="28" height="28" viewBox="0 0 24 24">
                  <Path d="M12 5V19M5 12L12 5L19 12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
                <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>INGRESO</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => openModal('EXPENSE')}
              >
                <Svg width="28" height="28" viewBox="0 0 24 24">
                  <Path d="M12 19V5M19 12L12 19L5 12" stroke="#F44336" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
                <Text style={[styles.actionButtonText, { color: '#F44336' }]}>GASTO</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => openModal('SAVINGS')}
              >
                <Svg width="28" height="28" viewBox="0 0 24 24">
                  <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2196F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <Path d="M12 6V12L16 14" stroke="#2196F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
                <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>AHORRO</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Svg width="20" height="20" viewBox="0 0 24 24" style={styles.searchIcon}>
                <Circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2" fill="none"/>
                <Path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
              </Svg>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar movimiento..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              <TouchableOpacity
                style={[styles.filterTab, !filterType && styles.filterTabActive]}
                onPress={() => setFilterType(undefined)}
              >
                <Text style={[styles.filterTabText, !filterType && styles.filterTabTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filterType === 'INCOME' && styles.filterTabActive]}
                onPress={() => setFilterType('INCOME')}
              >
                <Text style={[styles.filterTabText, filterType === 'INCOME' && styles.filterTabTextActive]}>Ingresos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filterType === 'EXPENSE' && styles.filterTabActive]}
                onPress={() => setFilterType('EXPENSE')}
              >
                <Text style={[styles.filterTabText, filterType === 'EXPENSE' && styles.filterTabTextActive]}>Gastos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterTab, filterType === 'SAVINGS' && styles.filterTabActive]}
                onPress={() => setFilterType('SAVINGS')}
              >
                <Text style={[styles.filterTabText, filterType === 'SAVINGS' && styles.filterTabTextActive]}>Ahorros</Text>
              </TouchableOpacity>
            </View>

            {/* FlatList con scroll infinito - SIN PAGINACIÓN */}
            <FlatList
              data={filteredMovements}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No hay movimientos</Text>
                  <Text style={styles.emptySubtext}>Agrega tu primer registro arriba</Text>
                </View>
              )}
              renderItem={({ item: movement }) => (
                <Swipeable
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, movement.id)
                  }
                >
                  <View style={styles.movementCard}>
                    <View style={[
                      styles.movementIcon,
                      { backgroundColor: movement.tipoMovimiento === 'INCOME' ? '#4CAF50' : movement.tipoMovimiento === 'SAVINGS' ? '#2196F3' : '#F44336' }
                    ]}>
                      <Svg width="20" height="20" viewBox="0 0 24 24">
                        <Circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                      </Svg>
                    </View>

                    <View style={styles.movementInfo}>
                      <Text style={styles.movementDescription}>{movement.descripcion}</Text>
                      <View style={styles.movementMeta}>
                        <Text style={styles.movementDate}>{formatDate(movement.fechaMovimiento)}</Text>
                        {movement.categoriaNombre && (
                          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(244, 67, 54, 0.2)' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#F44336' }]}>{movement.categoriaNombre}</Text>
                          </View>
                        )}
                        {movement.fuenteIngresoNombre && (
                          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                            <Text style={[styles.categoryBadgeText, { color: '#4CAF50' }]}>{movement.fuenteIngresoNombre}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={[
                      styles.movementAmount,
                      { color: movement.tipoMovimiento === 'INCOME' ? '#4CAF50' : movement.tipoMovimiento === 'SAVINGS' ? '#2196F3' : '#F44336' }
                    ]}>
                      {movement.tipoMovimiento === 'INCOME' ? '+' : '-'}{formatCurrency(movement.monto)}
                    </Text>
                  </View>
                </Swipeable>
              )}
            />
          </View>
        </BlurView>
      </ImageBackground>

      <CreateTransactionModal
        visible={modalVisible}
        initialType={modalType}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          refetch();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: { flex: 1, backgroundColor: '#000000' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  blurOverlay: { flex: 1, backgroundColor: 'transparent' },
  contentContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', fontSize: 16, marginTop: 16, fontWeight: '500' },
  header: { marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#4CAF50', marginTop: 4, fontWeight: '600' },
  elderKettleContainer: { alignItems: 'center', marginBottom: 16 },
  elderKettleImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFDF88' },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionButton: { 
    flex: 1, 
    borderRadius: 16, 
    padding: 14, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderWidth: 1.5, 
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  actionButtonText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  filterTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterTabText: { fontSize: 13, fontWeight: '700', color: '#BBB' },
  filterTabTextActive: { color: '#FFFFFF' },
  flatListContent: { paddingBottom: 20 },
  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#888' },
  movementCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  movementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  movementInfo: { flex: 1 },
  movementDescription: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  movementMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  movementDate: { fontSize: 12, color: '#AAA', fontWeight: '600' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryBadgeText: { fontSize: 11, fontWeight: '700' },
  movementAmount: { fontSize: 16, fontWeight: '800', marginLeft: 8 },
  deleteAction: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 16,
    marginBottom: 12,
  },
});
