import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

import {
    StyledContainer,
    InnerContainer,
    Colors,
} from '../components/style';
import { FadeInDown } from '../components/animated';
import { success } from '../components/haptics';

const { darkLight, brand, warning } = Colors;

const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const AuthField = ({ label, icon, error, ...props }) => {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputShell, error && styles.inputShellError]}>
                <MaterialCommunityIcons name={icon} size={17} color={darkLight} />
                <TextInput {...props} style={styles.input} placeholderTextColor="#70747C" />
            </View>
            {error && <Text style={styles.fieldError}>{error}</Text>}
        </View>
    );
};

const ProviderButton = ({ icon, label, onPress }) => (
    <Pressable style={styles.providerButton} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={17} color="#FFFFFF" />
        <Text style={styles.providerText}>{label}</Text>
    </Pressable>
);

const SignUp = () => {
    const navigation = useNavigation();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (values) => {
        setIsLoading(true);
        try {
            const userData = {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password,
            };

            const result = await signup(userData);
            if (result.success) {
                success();
                Alert.alert('Success', 'Account created successfully! Please log in.', [
                    {
                        text: 'Go to Login',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]);
            } else {
                Alert.alert('Signup Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <InnerContainer style={styles.inner}>
                        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                            <MaterialCommunityIcons name="arrow-left" size={19} color="#FFFFFF" />
                        </Pressable>

                        <FadeInDown delay={60} duration={500} style={styles.content}>
                            <Text style={styles.title}>Create your account</Text>
                            <Text style={styles.subtitle}>Start understanding your laptop better.</Text>

                            <Formik initialValues={{ name: '', surname: '', email: '', password: '', confirmPassword: '' }} validationSchema={SignupSchema} onSubmit={handleSignUp}>
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View style={styles.form}>
                                        <AuthField label="First name" icon="account-outline" placeholder="Your first name" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} error={touched.name && errors.name} />
                                        <AuthField label="Last name" icon="account-outline" placeholder="Your last name" value={values.surname} onChangeText={handleChange('surname')} onBlur={handleBlur('surname')} error={touched.surname && errors.surname} />
                                        <AuthField label="Email" icon="email-outline" placeholder="hello@company.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} error={touched.email && errors.email} />
                                        <AuthField label="Password" icon="lock-outline" placeholder="Create a password" secureTextEntry value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} error={touched.password && errors.password} />
                                        <AuthField label="Confirm password" icon="lock-check-outline" placeholder="Repeat your password" secureTextEntry value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')} error={touched.confirmPassword && errors.confirmPassword} />

                                        <Pressable style={[styles.primaryButton, isLoading && styles.disabledButton]} onPress={handleSubmit} disabled={isLoading}>
                                            {isLoading ? <ActivityIndicator color="#050505" /> : <Text style={styles.primaryButtonText}>Create account</Text>}
                                        </Pressable>
                                    </View>
                                )}
                            </Formik>

                            <View style={styles.dividerRow}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.divider} />
                            </View>

                            <ProviderButton icon="apple" label="Continue with Apple" onPress={() => Alert.alert('Unavailable', 'Apple sign-in is not configured yet.')} />
                            <ProviderButton icon="google" label="Continue with Google" onPress={() => Alert.alert('Unavailable', 'Google sign-in is not configured yet.')} />

                            <View style={styles.accountRow}>
                                <Text style={styles.accountText}>Already registered?</Text>
                                <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.accountLink}> Sign in</Text></Pressable>
                            </View>
                        </FadeInDown>
                    </InnerContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </StyledContainer>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 8, backgroundColor: '#050505' },
    keyboard: { flex: 1, width: '100%' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 8, paddingBottom: 18 },
    inner: { alignItems: 'stretch' },
    backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    content: { width: '100%' },
    title: { color: '#FFFFFF', fontSize: 27, fontWeight: '600', marginBottom: 12 },
    subtitle: { color: darkLight, fontSize: 14, marginBottom: 22 },
    form: { width: '100%' },
    fieldGroup: { marginBottom: 12 },
    label: { color: '#FFFFFF', fontSize: 11, marginBottom: 7 },
    inputShell: { height: 42, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#242424', backgroundColor: '#090909' },
    inputShellError: { borderColor: '#A86A6A' },
    input: { flex: 1, color: '#FFFFFF', fontSize: 12, paddingVertical: 0 },
    fieldError: { color: '#E58C8C', fontSize: 10, marginTop: 5 },
    primaryButton: { height: 43, borderRadius: 5, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
    disabledButton: { opacity: 0.65 },
    primaryButtonText: { color: '#050505', fontSize: 12, fontWeight: '600' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
    divider: { flex: 1, height: 1, backgroundColor: '#242424' },
    dividerText: { color: '#70747C', fontSize: 10 },
    providerButton: { height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#242424', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 9 },
    providerText: { color: '#FFFFFF', fontSize: 11 },
    accountRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    accountText: { color: darkLight, fontSize: 12 },
    accountLink: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});

export default SignUp;