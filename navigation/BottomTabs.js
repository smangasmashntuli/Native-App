/*import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

import Welcome from '../screens/Welcome';
import Chat from '../screens/Chat';
import Repair from '../screens/Repair';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';

import { Colors } from '../components/style';

const { brand, darkLight } = Colors;
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBaricon: ({focused, color, size}) => {
                    let iconName;
                    if(route.name === 'Home'){
                        iconName='home';
                    } else if(route.name === 'Chat'){
                        iconName='dependabot';
                    } else if(route.name === 'Repair'){
                        iconName='tools';
                    } else if(route.name === 'Notifications'){
                        iconName='bell';
                    } else if(route.name === 'Profile'){
                        iconName='person';
                    }
                    return <Octicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: brand,
                tabBarInactiveTintColor: darkLight,
                tabBarStyle: {
                    height: 60,
                    paddingVertical: 5,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={Welcome} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Repair" component={Repair} />
            <Tab.Screen name="Notifications" component={Notifications} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );

};


export default BottomTabs;*/


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Welcome from '../screens/Welcome';
import Chat from '../screens/Chat';
import Repair from '../screens/Repair';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import { Colors } from '../components/style';

const { brand, darkLight } = Colors;
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: brand,
                tabBarInactiveTintColor: darkLight,
                tabBarStyle: {
                    height: 60,
                    paddingVertical: 5,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={Welcome} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Repair" component={Repair} />
            <Tab.Screen name="Notifications" component={Notifications} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );

};


export default BottomTabs;