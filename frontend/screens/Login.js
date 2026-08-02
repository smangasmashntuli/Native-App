// Login.js
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

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
    Colors,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent
} from '../components/style';

const { brand, darkLight, primary } = Colors;

const MyTextInput = ({ label, icon, ...props }) => {
    return (
        <View style={{ marginBottom: 18 }}>
            <StyledInputLabel>{label}</StyledInputLabel>
            <View style={{ position: 'relative' }}>
                <LeftIcon>
                    <Octicons name={icon} size={24} color={brand} />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
        </View>
    );
};

const Login = () => {
    const navigation = useNavigation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const result = await login({
                email: values.email,
                password: values.password,
            });

            if (result.success) {
                navigation.navigate(result.needsSetup ? 'SetUp' : 'Welcome');
            } else {
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <View style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 26, shadowColor: '#0F172A', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 10 }, shadowRadius: 24, elevation: 6 }}>
                    <PageTitle>PC Doctor</PageTitle>
                    <SubTitle>Sign in to continue your diagnostics.</SubTitle>

                    <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin}>
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="support@pcdoctor.ai"
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
                                    secureTextEntry
                                />

                                <StyledButton onPress={handleSubmit} disabled={isLoading} style={{ backgroundColor: brand }}>
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={primary} />
                                    ) : (
                                        <ButtonText>Login</ButtonText>
                                    )}
                                </StyledButton>

                                <ExtraView>
                                    <ExtraText>New to PC Doctor? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate('SignUp')}>
                                        <TextLinkContent>Create account</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </View>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Login;