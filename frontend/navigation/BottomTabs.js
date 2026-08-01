import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Welcome from '../screens/Welcome';
import Chat from '../screens/Chat';
import Repair from '../screens/Repair';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import { Colors } from '../components/style';

const { brand, darkLight } = Colors;
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
          borderTopColor: '#CBD5E1',
          backgroundColor: '#FFFFFF',
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
  );
};

export default BottomTabs;
