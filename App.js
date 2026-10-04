import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvide, useAuth } from './frontend/context/AuthContext';
import { DashboardProvider } from './frontend/context/DashboardContext';
import Login from './frontend/screens/Login';
import SignUp from './frontend/screens/SignUp';
import SetUp from './frontend/screens/SetUp';
import BottomTabs from './frontend/navigation/BottomTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E0F11' }}>
        <ActivityIndicator size="large" color="#2FB8FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 400,
        contentStyle: { backgroundColor: '#0E0F11' },
      }}
    >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 400 }}
      />
      <Stack.Screen
        name="SetUp"
        component={SetUp}
        options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 400 }}
      />
      <Stack.Screen name="Welcome" component={BottomTabs} options={{ headerShown: false, animation: 'fade', animationDuration: 400 }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvide>
        <DashboardProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </DashboardProvider>
      </AuthProvide>
    </SafeAreaProvider>
  );
}
