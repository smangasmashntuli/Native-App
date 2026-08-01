import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BookProModal = ({ isOpen, onClose, deviceName }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-08-03');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [issueSummary, setIssueSummary] = useState('Thermal throttling and hardware diagnostic check');

  if (!isOpen) return null;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleDone = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={isOpen} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            {submitted ? (
              <>
                <Text style={styles.heading}>Appointment Reserved!</Text>
                <Text style={styles.subtext}>Your technician request is confirmed.</Text>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>Device</Text>
                  <Text style={styles.summaryValue}>{deviceName}</Text>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>{selectedDate}</Text>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>{selectedTime}</Text>
                  <Text style={styles.summaryLabel}>Issue</Text>
                  <Text style={styles.summaryValue}>{issueSummary}</Text>
                </View>
                <Pressable style={[styles.button, styles.primaryButton]} onPress={handleDone}>
                  <Text style={styles.buttonText}>Done</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Book Certified Pro</Text>
                <Text style={styles.subtext}>Schedule an authorized technician inspection with ESD safe procedures.</Text>
                <View style={styles.infoPill}>
                  <Text style={styles.infoPillText}>Includes Express Diagnostic Audit for {deviceName}</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Primary Issue</Text>
                  <TextInput
                    style={styles.input}
                    value={issueSummary}
                    onChangeText={setIssueSummary}
                    multiline
                    placeholder="Describe the problem"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.row}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.label}>Preferred Date</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedDate}
                      onChangeText={setSelectedDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.label}>Time Slot</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedTime}
                      onChangeText={setSelectedTime}
                      placeholder="10:00 AM"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <Pressable style={[styles.button, styles.primaryButton]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Confirm Booking</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
          <Pressable style={styles.closeArea} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 14,
  },
  content: {
    paddingBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 16,
  },
  infoPill: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  infoPillText: {
    fontSize: 13,
    color: '#3730A3',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    minHeight: 42,
  },
  button: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#6D28D9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginVertical: 14,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 10,
  },
  summaryValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 4,
  },
  closeArea: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeText: {
    color: '#6D28D9',
    fontWeight: '700',
  },
});

export default BookProModal;
