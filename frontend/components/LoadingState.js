import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from './style';

const { brand, darkLight } = Colors;

/**
 * Reusable loading state component
 * 
 * @param {string} message - Loading message to display
 * @param {string} size - Spinner size ('small' or 'large')
 * @param {object} style - Additional styles for container
 */
const LoadingState = ({ message = 'Loading...', size = 'large', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={brand} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    marginTop: 12,
    fontSize: 14,
    color: darkLight,
    textAlign: 'center',
  },
};

export default LoadingState;