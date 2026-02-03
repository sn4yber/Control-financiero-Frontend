import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useCreateMovement } from '../hooks/useCreateMovement';
import { useCategories } from '../../categories/hooks/useCategories';
import { useIncomeSources } from '../../income-sources/hooks/useIncomeSources';
import { useGoals } from '../../goals/hooks/useGoals';

export const CreateTransactionModal = ({ visible, onClose, onSuccess, initialType = 'EXPENSE' }) => {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [incomeSourceId, setIncomeSourceId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [isRecurrent, setIsRecurrent] = useState(false);

  const { createMovement, loading } = useCreateMovement();
  const { categories } = useCategories(type === 'EXPENSE' ? 'EXPENSE' : undefined);
  const { incomeSources } = useIncomeSources();
  const { goals } = useGoals();

  const handleSubmit = async () => {
    if (!amount || !description) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      await createMovement({
        tipoMovimiento: type,
        monto: parseFloat(amount.replace(/[^0-9]/g, '')),
        descripcion: description,
        fechaMovimiento: date,
        esRecurrente: isRecurrent,
        patronRecurrencia: isRecurrent ? 'MENSUAL' : null,
        categoriaId: type === 'EXPENSE' && categoryId ? parseInt(categoryId) : null,
        fuenteIngresoId: type === 'INCOME' && incomeSourceId ? parseInt(incomeSourceId) : null,
        metaId: type === 'SAVINGS' && goalId ? parseInt(goalId) : null,
      });
      
      onSuccess();
      resetForm();
    } catch (error) {
      alert(error.message || 'Error al crear movimiento');
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setIncomeSourceId('');
    setGoalId('');
    setIsRecurrent(false);
  };

  const formatAmount = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return new Intl.NumberFormat('es-CO').format(parseInt(numbers));
  };



  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={80} tint="dark" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Svg width="24" height="24" viewBox="0 0 24 24" style={styles.modalIcon}>
                  {type === 'INCOME' && (
                    <Path d="M12 5V19M5 12L12 5L19 12" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                  {type === 'SAVINGS' && (
                    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#2196F3"/>
                  )}
                  {type === 'EXPENSE' && (
                    <Path d="M12 19V5M19 12L12 19L5 12" stroke="#F44336" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </Svg>
                <Text style={styles.modalTitle}>
                  {type === 'INCOME' ? 'Nuevo Ingreso' : type === 'SAVINGS' ? 'Nuevo Ahorro' : 'Nuevo Gasto'}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Path d="M18 6L6 18M6 6L18 18" stroke="#2D1B4E" strokeWidth="2" strokeLinecap="round"/>
                </Svg>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Type Selector */}
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'INCOME' && styles.typeButtonActive]}
                  onPress={() => setType('INCOME')}
                >
                  <Text style={[styles.typeButtonText, type === 'INCOME' && styles.typeButtonTextActive]}>
                    Ingreso
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'EXPENSE' && styles.typeButtonActive]}
                  onPress={() => setType('EXPENSE')}
                >
                  <Text style={[styles.typeButtonText, type === 'EXPENSE' && styles.typeButtonTextActive]}>
                    Gasto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'SAVINGS' && styles.typeButtonActive]}
                  onPress={() => setType('SAVINGS')}
                >
                  <Text style={[styles.typeButtonText, type === 'SAVINGS' && styles.typeButtonTextActive]}>
                    Ahorro
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monto *</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(value) => setAmount(formatAmount(value))}
                  />
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Pago de arriendo"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Category (EXPENSE) */}
              {type === 'EXPENSE' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Categoría</Text>
                  <View style={styles.pickerContainer}>
                    {(categories || []).map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.chip, categoryId == cat.id && styles.chipSelected]}
                        onPress={() => setCategoryId(cat.id.toString())}
                      >
                        <Text style={[styles.chipText, categoryId == cat.id && styles.chipTextSelected]}>
                          {cat.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Income Source (INCOME) */}
              {type === 'INCOME' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fuente de Ingreso</Text>
                  <View style={styles.pickerContainer}>
                    {(incomeSources || []).map((src) => (
                      <TouchableOpacity
                        key={src.id}
                        style={[styles.chip, incomeSourceId == src.id && styles.chipSelected]}
                        onPress={() => setIncomeSourceId(src.id.toString())}
                      >
                        <Text style={[styles.chipText, incomeSourceId == src.id && styles.chipTextSelected]}>
                          {src.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Goal (SAVINGS) */}
              {type === 'SAVINGS' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Meta</Text>
                  <View style={styles.pickerContainer}>
                    {(goals || []).map((goal) => (
                      <TouchableOpacity
                        key={goal.id}
                        style={[styles.chip, goalId == goal.id && styles.chipSelected]}
                        onPress={() => setGoalId(goal.id.toString())}
                      >
                        <Text style={[styles.chipText, goalId == goal.id && styles.chipTextSelected]}>
                          {goal.nombre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Recurrent */}
              <View style={styles.switchGroup}>
                <Text style={styles.label}>Recurrente</Text>
                <Switch value={isRecurrent} onValueChange={setIsRecurrent} trackColor={{ true: '#FFDF88' }} />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#2D1B4E" />
              ) : (
                <Text style={styles.submitButtonText}>Guardar Movimiento</Text>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  modalContent: {
    backgroundColor: '#000000',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIcon: {
    marginRight: 8,
  },  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingHorizontal: 20,
    maxHeight: 500,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2D1B4E',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B39DDB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#B39DDB',
    marginRight: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#7E57C2',
    borderColor: '#7E57C2',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#7E57C2',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
