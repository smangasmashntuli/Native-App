import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';

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
} from '../components/style';

const { brand, darkLight, primary } = Colors;

const SetupSchema = Yup.object().shape({
    brand: Yup.string().required('Brand is required'),
    model: Yup.string().required('Model is required'),
});

const MyTextInput = ({ label, icon, ...props}) => {
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

const SetUp = () => {
    const navigation = useNavigation();
    const { setup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSetup = async (values) => {
        setIsLoading(true);
        try {
            const result = await setup({
                brand: values.brand,
                model: values.model,
            });

            if (result.success) {
                Alert.alert('Success', 'Laptop registered successfully!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Welcome'),
                    },
                ]);
            } else {
                Alert.alert('Setup Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Setup Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <View style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 26, shadowColor: '#0F172A', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 10 }, shadowRadius: 24, elevation: 6 }}>
                    <PageTitle>Device Setup</PageTitle>
                    <SubTitle>Connect your system to PC Doctor AI.</SubTitle>

                    <Formik initialValues={{ brand: '', model: '' }} validationSchema={SetupSchema} onSubmit={handleSetup}>
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Brand"
                                    icon="device-desktop"
                                    placeholder="Dell, HP, Lenovo..."
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('brand')}
                                    onBlur={handleBlur('brand')}
                                    value={values.brand}
                                />
                                {touched.brand && errors.brand && <Text style={{ color: '#DC2626', fontSize: 12, marginBottom: 10 }}>{errors.brand}</Text>}

                                <MyTextInput
                                    label="Model"
                                    icon="cpu"
                                    placeholder="Enter model number"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('model')}
                                    onBlur={handleBlur('model')}
                                    value={values.model}
                                />
                                {touched.model && errors.model && <Text style={{ color: '#DC2626', fontSize: 12, marginBottom: 10 }}>{errors.model}</Text>}

                                <StyledButton onPress={handleSubmit} disabled={isLoading} style={{ backgroundColor: brand }}>
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={primary} />
                                    ) : (
                                        <ButtonText>Register Laptop</ButtonText>
                                    )}
                                </StyledButton>
                            </StyledFormArea>
                        )}
                    </Formik>
                </View>
            </InnerContainer>
        </StyledContainer>
    );
};

export default SetUp;