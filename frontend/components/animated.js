import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { light } from './haptics';

/**
 * Wraps children in a fade-in + slide-down entrance animation that mirrors
 * the Inspo `FadeInDown` look. Uses React Native's built-in Animated API so
 * no native module is required.
 */
export const FadeInDown = ({
  children,
  delay = 0,
  duration = 500,
  distance = 18,
  style,
  ...rest
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, duration, distance, opacity, translateY]);

  return (
    <Animated.View
      style={[{ opacity, transform: [{ translateY }] }, style]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Simple fade-in entrance (no movement) — useful for elements that should
 * appear in place, such as floating buttons.
 */
export const FadeIn = ({ children, delay = 0, duration = 400, style, ...rest }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, opacity]);

  return (
    <Animated.View style={[{ opacity }, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

/**
 * Press feedback: scales down on press-in and springs back on release.
 * Mirrors Inspo's `PressableScale`. Optionally fires a light haptic.
 */
export const PressableScale = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  style,
  scaleTo = 0.96,
  haptic = true,
  disabled = false,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e) => {
    Animated.spring(scale, {
      toValue: scaleTo,
      friction: 7,
      tension: 140,
      useNativeDriver: true,
    }).start();
    onPressIn && onPressIn(e);
  };

  const handlePressOut = (e) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
    onPressOut && onPressOut(e);
  };

  const handlePress = (e) => {
    if (haptic) light();
    onPress && onPress(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Circle icon action button. Active state glows cyan (see theme colors).
 * Mirrors Inspo's `RoundAction`.
 */
export const RoundAction = ({ icon: Icon, active = false, onPress, size = 54, color }) => {
  const glowColor = color || '#2FB8FF';
  return (
    <PressableScale onPress={onPress} style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: active ? 'rgba(47,184,255,0.16)' : '#14171B',
          borderWidth: 1,
          borderColor: active ? glowColor : '#23272C',
          shadowColor: glowColor,
          shadowOpacity: active ? 0.6 : 0,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 0 },
          elevation: active ? 8 : 0,
        }}
      >
        {Icon ? (
          <Icon size={22} color={active ? glowColor : '#B9BFC7'} />
        ) : null}
      </View>
    </PressableScale>
  );
};

export default { FadeInDown, FadeIn, PressableScale, RoundAction };
