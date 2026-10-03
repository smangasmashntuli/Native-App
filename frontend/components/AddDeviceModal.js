import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddDeviceModal = ({ isOpen, onClose, onAddDevice }) => {
  const [name, setName] = useState('');
  const [processor, setProcessor] = useState('Intel Core i7-14700K');
  const [ram, setRam] = useState('32GB DDR5 6000MHz');
  const [storage, setStorage] = useState('1TB NVMe SSD');
  const [gpu, setGpu] = useState('NVIDIA RTX 4070');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const newDevice = {
      id: `dev-${Date.now()}`,
      name,
      specs: `${processor} • ${ram} • ${storage}`,
      processor,
      ram,
      storage,
      gpu,
      batteryHealth: 'Normal',
      batteryPercentage: 92,
      cpuUsagePercentage: 24,
      storageUsedGB: 310,
      storageTotalGB: 1024,
      gpuTempC: 45,
      cpuTempC: 52,
      fanSpeedRPM: 2100,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
      isActive: true,
    };

    onAddDevice(newDevice);
    onClose();
    setName('');
  };

  return (
    <Modal animationType="slide" transparent visible={isOpen} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.heading}>Register New Device</Text>
          <Text style={styles.subtext}>Add a hardware profile for live diagnostics and telemetry.</Text>

          <ScrollView style={styles.form} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Alienware M18"
                placeholderTextColor="#8A9099"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>CPU</Text>
                <TextInput style={styles.input} value={processor} onChangeText={setProcessor} placeholder="Intel Core i9-14900K" placeholderTextColor="#8A9099" />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Memory</Text>
                <TextInput style={styles.input} value={ram} onChangeText={setRam} placeholder="32GB DDR5" placeholderTextColor="#8A9099" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>Storage</Text>
                <TextInput style={styles.input} value={storage} onChangeText={setStorage} placeholder="2TB NVMe" placeholderTextColor="#8A9099" />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>GPU</Text>
                <TextInput style={styles.input} value={gpu} onChangeText={setGpu} placeholder="NVIDIA RTX 4080" placeholderTextColor="#8A9099" />
              </View>
            </View>
          </ScrollView>

          <View style={styles.controls}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.primaryButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Device</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#17191D',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: '#8A9099',
    marginBottom: 16,
  },
  form: {
    maxHeight: 320,
  },
  formContent: {
    paddingBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    color: '#8A9099',
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#23272C',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    backgroundColor: '#14171B',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  button: {
    minWidth: 112,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2FB8FF',
  },
  cancelButton: {
    backgroundColor: '#14171B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelText: {
    color: '#C6CBD2',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default AddDeviceModal;
