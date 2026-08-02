import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const SafetyGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal animationType="slide" transparent visible={isOpen} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Hardware Safety Guide</Text>
            <Text style={styles.subtext}>Follow these precautions before you open your laptop or desktop chassis.</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Power & Discharge</Text>
              <Text style={styles.sectionText}>Disconnect the power adapter and battery. Leave the system unplugged for 5 minutes before touching internal components.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Electrostatic Protection</Text>
              <Text style={styles.sectionText}>Wear an anti-static wrist strap or ground yourself on a metal surface to prevent static discharge.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Battery Hazards</Text>
              <Text style={styles.sectionText}>Do not puncture, bend, or compress the battery. If swelling or smoke is present, stop work immediately and seek professional service.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Tool Handling</Text>
              <Text style={styles.sectionText}>Use the correct screwdriver head and avoid excessive force when removing screws.</Text>
            </View>
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close Guide</Text>
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
    maxHeight: '85%',
  },
  content: {
    paddingBottom: 18,
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
    marginBottom: 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    fontSize: 14,
  },
  sectionText: {
    color: '#475569',
    lineHeight: 20,
    fontSize: 13,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#6D28D9',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  closeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default SafetyGuideModal;
