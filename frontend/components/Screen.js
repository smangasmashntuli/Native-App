import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme/theme';

/**
 * Screen wrapper providing the dark gradient background used across the app.
 * Mirrors the Inspo `LinearGradient` + `SafeAreaView` screen shells.
 *
 * @param {array} colors - Optional gradient colors (defaults to app screen gradient)
 * @param {boolean} safe - Whether to render a SafeAreaView (default true)
 */
export const Screen = ({ children, colors, safe = true, style }) => {
  const Container = safe ? SafeAreaView : View;
  return (
    <LinearGradient
      colors={colors || gradients.screen}
      style={{ flex: 1, backgroundColor: '#0E0F11' }}
    >
      <StatusBar style="light" />
      <Container style={[{ flex: 1 }, style]}>{children}</Container>
    </LinearGradient>
  );
};

export default Screen;
