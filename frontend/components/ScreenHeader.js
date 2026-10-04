import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './animated';

/**
 * Back arrow + centered letter-spaced title + settings gear.
 * Mirrors Inspo's `ScreenHeader`.
 */
export const ScreenHeader = ({ title, onBack, onSettings }) => {
  const circleStyle = {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#17191D',
    borderWidth: 1,
    borderColor: '#23272C',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        marginTop: 6,
        marginBottom: 6,
      }}
    >
      {onBack ? (
        <PressableScale onPress={onBack} style={circleStyle}>
          <Ionicons name="chevron-back" size={20} color="#E8EAED" />
        </PressableScale>
      ) : (
        <View style={{ width: 42 }} />
      )}

      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: '700',
          letterSpacing: 3,
          textAlign: 'center',
          flex: 1,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {onSettings ? (
        <PressableScale onPress={onSettings} style={circleStyle}>
          <Ionicons name="settings-outline" size={19} color="#8A9099" />
        </PressableScale>
      ) : (
        <View style={{ width: 42 }} />
      )}
    </View>
  );
};

export default ScreenHeader;
