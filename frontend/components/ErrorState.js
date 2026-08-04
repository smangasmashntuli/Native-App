import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, StyledButton, ButtonText } from './style';

const { brand, darkLight, tertiary } = Colors;

/**
 * Reusable error state component
 * 
 * @param {string} message - Error message to display
 * @param {function} onRetry - Retry callback function
 * @param {string} retryText - Text for retry button (default: 'Try Again')
 * @param {object} style - Additional styles for container
 */
const ErrorState = ({ message = 'Something went wrong', onRetry, retryText = 'Try Again', style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <StyledButton onPress={onRetry} style={styles.retryButton}>
          <ButtonText>{retryText}</ButtonText>
        </StyledButton>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  message: {
    fontSize: 14,
    color: darkLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: brand,
    minWidth: 140,
  },
};

export default ErrorState;