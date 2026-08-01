import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="SetUp" component={SetUp} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={BottomTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvide>
      <DashboardProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </DashboardProvider>
    </AuthProvide>
  );
}
