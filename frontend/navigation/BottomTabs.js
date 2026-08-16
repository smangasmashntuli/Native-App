import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Welcome from '../screens/Welcome';
import Chat from '../screens/Chat';
import Repair from '../screens/Repair';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import HeaderCard from '../components/HeaderCard';
import { Colors } from '../components/style';

const { brand, darkLight, border, secondary, primary } = Colors;
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home-outline',
  Chat: 'robot-outline',
  Repair: 'wrench-outline',
  Alerts: 'bell-outline',
  Profile: 'account-circle-outline',
};

const BottomTabs = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <HeaderCard />
      <View style={styles.navigatorContainer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={ICONS[route.name]} size={size} color={color} />
            ),
            tabBarActiveTintColor: brand,
            tabBarInactiveTintColor: darkLight,
            tabBarShowLabel: true,
            tabBarStyle: {
              height: 64,
              paddingVertical: 8,
              borderTopWidth: 1,
              borderTopColor: border,
              backgroundColor: secondary,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
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
});

export default BottomTabs;
