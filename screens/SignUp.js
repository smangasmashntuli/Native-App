import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
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

const { brand, darkLight, primary, tertiary } = Colors;


const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});


const MyTextInput = ({ label, icon, ...props}) => {
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

const SignUp = () => {
    const navigation = useNavigation();
    const {signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (values) => {
        setIsLoading(true);
        try{
            const userData = {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password
            };

            const result = await signup(userData);
            if(result.success){
                Alert.alert(
                    'Success',
                    'Account created successfully! Please log in.',
                    [{
                        text: 'Go to Login',
                        onPress: () => navigation.navigate('Login')
                    },
                ]
                );
            } else {
                Alert.alert('Signup Failed', result.error);
            }

        } catch (error){
            Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Sign Up</PageTitle>
                <SubTitle>Create an account to get started!</SubTitle>

                <Formik
                    initialValues={{ name: '', surname: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSignUp}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="Name"
                                icon="person"
                                placeholder="Enter your name"
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />
                            {touched.name && errors.name && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.name}</Text>
                        )}
                            <MyTextInput
                                label="Surname"
                                icon="person"
                                placeholder="Enter your surname"
                                onChangeText={handleChange('surname')}
                                onBlur={handleBlur('surname')}
                                value={values.surname}
                            />
                            {touched.surname && errors.surname && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.surname}</Text>
                        )}
                            <MyTextInput
                                label="Email Address"
                                icon="mail"
                                placeholder="Enter your email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            {touched.email && errors.email && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.email}</Text>
                        )}
                            <MyTextInput
                                label="Password"
                                icon="lock"
                                placeholder="Enter your password"
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={true}
                            />
                            {touched.password && errors.password && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.password}</Text>
                        )}
                            <MyTextInput
                                label="Confirm Password"
                                icon="lock"
                                placeholder="Enter your password again"
                                secureTextEntry
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={true}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.confirmPassword}</Text>
                        )}

                            <StyledButton onPress={handleSubmit} disabled={isLoading}>
                                {isLoading ? (<ActivityIndicator size="small" color={primary}/>) : (<ButtonText>Sign Up</ButtonText>)}
                            </StyledButton>

                            <ExtraView>
                                <ExtraText>Already have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>Login</TextLinkContent>
                                </TextLink>
                            </ExtraView>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    )
};

export default SignUp;