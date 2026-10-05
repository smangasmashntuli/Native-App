import React from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './animated';

/**
 * Pill-shaped cyan -> teal gradient action button with a soft glow.
 * Mirrors Inspo's `GradientButton` but uses the built-in Animated press
 * feedback (via PressableScale) so no native module is required.
 */
export const GradientButton = ({
  label,
  children,
  icon: Icon,
  onPress,
  disabled = false,
  loading = false,
  style,
  colors = ['#6bcdfd', '#9EECD9'],
  textColor = '#FFFFFF',
}) => {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      style={[{ alignSelf: 'center', opacity: disabled ? 0.6 : 1 }, style]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 40,
          gap: 10,
          shadowColor: '#2FB8FF',
          shadowOpacity: 0.45,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        }}
      >
        {Icon && !loading ? <Icon size={18} color={textColor} /> : null}
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>
          {children || label}
        </Text>
      </LinearGradient>
    </PressableScale>
  );
};

export default GradientButton;
