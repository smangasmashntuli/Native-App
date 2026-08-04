import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Colors, StyledButton, ButtonText } from './style';
import { AntDesign, Feather } from '@expo/vector-icons';

const { brand, darkLight, tertiary } = Colors;

/**
 * Bottom sheet modal for displaying component information
 * 
 * @param {boolean} visible - Modal visibility
 * @param {string} componentName - Name of the component
 * @param {string} explanation - Component explanation text
 * @param {boolean} loading - Loading state
 * @param {function} onClose - Close callback
 */
const ComponentInfoModal = ({ visible, componentName, explanation, loading, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Feather name="cpu" size={20} color={brand} style={{ marginRight: 8 }} />
              <Text style={styles.title}>{componentName || 'Component'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={20} color={darkLight} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={brand} />
                <Text style={styles.loadingText}>Fetching component information...</Text>
              </View>
            ) : explanation ? (
              <View>
                <Text style={styles.explanationText}>{explanation}</Text>

                {/* Safety Warning */}
                <View style={styles.safetyWarning}>
                  <AntDesign name="exclamationcircle" size={16} color="#991B1B" style={{ marginRight: 8 }} />
                  <Text style={styles.safetyText}>
                    Always disconnect the battery before touching internal components.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Unable to fetch component information. Please try again.</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <StyledButton onPress={onClose} style={styles.closeBtn}>
              <ButtonText>Close</ButtonText>
            </StyledButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '70%',
    minHeight: '40%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  content: {
    padding: 20,
    paddingTop: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: darkLight,
  },
  explanationText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 16,
  },
  safetyWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  safetyText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 18,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: darkLight,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 12,
  },
  closeBtn: {
    backgroundColor: brand,
  },
};

export default ComponentInfoModal;