import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Welcome from '../screens/Welcome';
import Chat from '../screens/Chat';
import Repair from '../screens/Repair';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import HeaderCard from '../components/HeaderCard';
import { Colors } from '../components/style';
import { light } from '../components/haptics';

const { brand, darkLight, border, secondary, primary } = Colors;
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home-outline',
  Chat: 'robot-outline',
  Repair: 'wrench-outline',
  Alerts: 'bell-outline',
  Profile: 'account-circle-outline',
};

/**
 * Custom Tesla-style tab bar: dark translucent surface with a hairline top
 * border and a glowing cyan active state (mirrors Inspo's TeslaTabBar).
 */
const DarkTabBar = ({ state, descriptors, navigation }) => (
  <View style={styles.tabBarWrapper}>
    <LinearGradient
      colors={['rgba(23,25,29,0.98)', 'rgba(13,15,17,0.94)']}
      style={styles.tabBar}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? brand : darkLight;
        const label = descriptors[route.key]?.options?.title || route.name;

        const onPress = () => {
          light();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} style={styles.tabItem} onPress={onPress} android_ripple={{ borderless: true, color: 'rgba(47,184,255,0.12)' }}>
            <MaterialCommunityIcons
              name={ICONS[route.name]}
              size={24}
              color={color}
              style={focused ? styles.glow : undefined}
            />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            {focused ? <View style={styles.activeDot} /> : <View style={styles.inactiveDot} />}
          </Pressable>
        );
      })}
    </LinearGradient>
  </View>
);

const BottomTabs = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <HeaderCard />
      <View style={styles.navigatorContainer}>
        <Tab.Navigator
          tabBar={(props) => <DarkTabBar {...props} />}
          screenOptions={({ route }) => ({
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={Welcome} />
          <Tab.Screen name="Chat" component={Chat} />
          <Tab.Screen name="Repair" component={Repair} />
          <Tab.Screen name="Alerts" component={Notifications} options={{ title: 'Alerts' }} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: primary,
  },
  navigatorContainer: {
    flex: 1,
    backgroundColor: primary,
  },
  tabBarWrapper: {
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: border,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  glow: {
    textShadowColor: brand,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: brand,
    marginTop: 2,
  },
  inactiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
});

export default BottomTabs;
