//app.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { AuthProvide, useAuth } from './context/AuthContext';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Welcome from './screens/Welcome';
import {ActivityIndicator, View} from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, loading} = useAuth();
  if(loading){
    return(
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
      );
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Welcome" : "Login"}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
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
  

