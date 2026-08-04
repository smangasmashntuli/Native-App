import React from 'react';
import { View, Text } from 'react-native';
import { Colors, StyledButton, ButtonText } from './style';

const { brand, darkLight, tertiary } = Colors;

/**
 * Reusable empty state component
 * 
 * @param {string} message - Empty state message to display
 * @param {string} actionText - Text for action button (optional)
 * @param {function} onAction - Action callback function (optional)
 * @param {string} icon - Emoji icon to display (optional)
 * @param {object} style - Additional styles for container
 */
const EmptyState = ({ 
  message = 'No data available', 
  actionText, 
  onAction, 
  icon = '📭',
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onAction && actionText && (
        <StyledButton onPress={onAction} style={styles.actionButton}>
          <ButtonText>{actionText}</ButtonText>
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
  actionButton: {
    backgroundColor: brand,
    minWidth: 140,
  },
};

export default EmptyState;