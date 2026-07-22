// Login.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {useAuth} from '../context/AuthContext';

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
    const { login, loading, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (values) => {
        setIsLoading(true);
        try{
            const result = await login ({
                email: values.email,
                password: values.password
            });

            if(result.success){
                navigation.navigate('Welcome');
            } else {
                Alert.alert('Login Failed', result.error);
            }
        } catch(error){
            Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
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
                            
                            <StyledButton onPress={handleSubmit} disabled={isLoading}>
                                {isLoading ? (<ActivityIndicator size="small" color={primary}/>) : (<ButtonText>Login</ButtonText>)}
                            </StyledButton>

                            <ExtraView>
                                <ExtraText>Don't have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('SignUp')}>
                                    <TextLinkContent>Sign Up</TextLinkContent>
                                </TextLink>
                            </ExtraView>

                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Login;