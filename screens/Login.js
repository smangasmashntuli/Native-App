// Login.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    StyledFormArea,
    SubTitle,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    Colors
} from '../components/style';

const { brand, darkLight, primary, tertiary } = Colors;

const MyTextInput = ({ label, icon, ...props }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <StyledInputLabel>{label}</StyledInputLabel>
            <View style={{ position: 'relative' }}>
                <LeftIcon>
                    <Octicons name={icon} size={30} color={brand} />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
        </View>
    );
};

const Login = () => {
    const navigation = useNavigation();

    const handleLogin = (values) => {
        console.log(values);
        if (values.email && values.password) {
            navigation.navigate('Welcome');
        } else {
            Alert.alert('Error', 'Please enter both email and password');
        }
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Login</PageTitle>
                <SubTitle>Welcome back you've been missed!</SubTitle>
                
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="Email Address"
                                icon="mail"
                                placeholder="Enter your email"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            
                            <MyTextInput
                                label="Password"
                                icon="lock"
                                placeholder="Enter your password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={true}
                            />
                            
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Login;