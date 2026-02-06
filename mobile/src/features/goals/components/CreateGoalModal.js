import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateGoal } from '../hooks/useCreateGoal';
import { useUpdateGoal } from '../hooks/useUpdateGoal';

// Iconos SVG
const CloseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 2V6M8 2V6M3 10H21" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CreateGoalModal = ({ visible, onClose, onSuccess, initialData }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [fechaObjetivo, setFechaObjetivo] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [prioridad, setPrioridad] = useState('MEDIUM');

  const { createGoal, loading: creating, error: createError } = useCreateGoal();
  const { updateGoal, loading: updating, error: updateError } = useUpdateGoal();
  
  const loading = creating || updating;
  const error = createError || updateError;
  const isEditing = !!initialData;

  useEffect(() => {
    if (visible && initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion || '');
      setMontoObjetivo(initialData.montoObjetivo.toString());
      setDisplayAmount(new Intl.NumberFormat('es-CO').format(initialData.montoObjetivo));
      setFechaObjetivo(new Date(initialData.fechaObjetivo));
      setPrioridad(initialData.prioridad);
    } else if (visible) {
      setNombre('');
      setDescripcion('');
      setMontoObjetivo('');
      setDisplayAmount('');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFechaObjetivo(tomorrow);
      setPrioridad('MEDIUM');
    }
  }, [visible, initialData]);

  const handleAmountChange = (text) => {
    const rawValue = text.replace(/\D/g, '');
    
    if (rawValue === '') {
      setMontoObjetivo('');
      setDisplayAmount('');
      return;
    }

    const numberValue = parseInt(rawValue, 10);
    setMontoObjetivo(numberValue.toString());
    setDisplayAmount(new Intl.NumberFormat('es-CO').format(numberValue));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaObjetivo(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !montoObjetivo || !fechaObjetivo) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      // Formatear fecha en formato ISO (YYYY-MM-DD)
      const year = fechaObjetivo.getFullYear();
      const month = String(fechaObjetivo.getMonth() + 1).padStart(2, '0');
      const day = String(fechaObjetivo.getDate()).padStart(2, '0');
      const fechaISO = `${year}-${month}-${day}`;

      const formValues = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        montoObjetivo: parseFloat(montoObjetivo),
        fechaObjetivo: fechaISO,
        prioridad
      };

      console.log('Sending goal data:', formValues);

      if (isEditing && initialData) {
        await updateGoal(initialData.id, {
          ...initialData,
          ...formValues,
          usuarioId: initialData.usuarioId,
          montoActual: initialData.montoActual,
          estado: initialData.estado
        });
      } else {
        await createGoal(formValues);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating/updating goal:', err);
      Alert.alert('Error', err.response?.data?.message || err.message || 'No se pudo guardar la meta');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Editar Meta' : 'Nueva Meta'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre de la Meta *</Text>
                <TextInput
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Ej: Viaje a Europa"
                  placeholderTextColor="#666666"
                />
              </View>

              {/* Descripción */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Describe tu meta..."
                  placeholderTextColor="#666666"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Monto Objetivo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monto Objetivo *</Text>
                <View style={styles.inputWithPrefix}>
                  <Text style={styles.prefix}>$</Text>
                  <TextInput
                    style={[styles.input, styles.inputWithPrefixText]}
                    value={displayAmount}
                    onChangeText={handleAmountChange}
                    placeholder="0"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Fecha Objetivo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha Objetivo *</Text>
                <TouchableOpacity 
                  style={styles.dateInputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <CalendarIcon />
                  <Text style={styles.dateText}>
                    {formatDate(fechaObjetivo)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={fechaObjetivo}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    textColor="#FFFFFF"
                  />
                )}
              </View>

              {/* Prioridad */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prioridad</Text>
                <View style={styles.priorityButtons}>
                  <TouchableOpacity
                    style={[styles.priorityButton, prioridad === 'LOW' && styles.priorityButtonActive]}
                    onPress={() => setPrioridad('LOW')}
                  >
                    <Text style={[styles.priorityText, prioridad === 'LOW' && styles.priorityTextActive]}>Baja</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.priorityButton, prioridad === 'MEDIUM' && styles.priorityButtonActive]}
                    onPress={() => setPrioridad('MEDIUM')}
                  >
                    <Text style={[styles.priorityText, prioridad === 'MEDIUM' && styles.priorityTextActive]}>Media</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.priorityButton, prioridad === 'HIGH' && styles.priorityButtonActive]}
                    onPress={() => setPrioridad('HIGH')}
                  >
                    <Text style={[styles.priorityText, prioridad === 'HIGH' && styles.priorityTextActive]}>Alta</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Actualizar Meta' : 'Crear Meta'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingLeft: 14,
  },
  prefix: {
    color: '#888888',
    fontSize: 16,
    marginRight: 8,
  },
  inputWithPrefixText: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  dateText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#B379DF',
    borderColor: '#B379DF',
  },
  priorityText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#B379DF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
