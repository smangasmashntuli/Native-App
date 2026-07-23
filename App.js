//app.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { AuthProvide, useAuth } from './context/AuthContext';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import SetUp from './screens/SetUp';
import {ActivityIndicator, View} from 'react-native';

import BottomTabs from './navigation/BottomTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, loading, needsSetup} = useAuth();
  if(loading){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
      );
  }

  // Determine initial route based on auth status and setup status
  let initialRoute = "Login";
  if (isAuthenticated) {
    initialRoute = needsSetup ? "SetUp" : "Welcome";
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SetUp"
        component={SetUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Welcome"
        component={BottomTabs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <AuthProvide>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvide>
  );
}