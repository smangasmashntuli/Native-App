import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, StyledButton, ButtonText } from './style';

const { brand, darkLight, tertiary } = Colors;

/**
 * Reusable empty state component
 * 
 * @param {string} message - Empty state message to display
 * @param {string} actionText - Text for action button (optional)
 * @param {function} onAction - Action callback function (optional)
 * @param {string} icon - MaterialCommunityIcons name to display (optional)
 * @param {object} style - Additional styles for container
 */
const EmptyState = ({ 
  message = 'No data available', 
  actionText, 
  onAction, 
  icon = 'inbox-outline',
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={40} color={brand} />
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
    backgroundColor: '#0E0F11',
  },
  iconContainer: {
    marginBottom: 16,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
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
    borderRadius: 40,
  },
};

export default EmptyState;