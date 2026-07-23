import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent
} from '../components/style';

const { brand, darkLight, primary, tertiary } = Colors;

const SetupSchema = Yup.object().shape({
    brand: Yup.string().required('Brand is required'),
    model: Yup.string().required('Model is required'),
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

const SetUp = () => {
    const navigation = useNavigation();
    const { setup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSetup = async (values) => {
        setIsLoading(true);
        try{
            const result = await setup({
                brand: values.brand,
                model: values.model
            });

            if (result.success) {
                Alert.alert(
                    'Success',
                    'Laptop registered successfully!',
                    [{
                        text: 'Continue',
                        onPress: () => navigation.navigate('Welcome')
                    }]
                );
            } else {
                Alert.alert('Setup Failed', result.error);
            }
        } catch (error){
            Alert.alert('Setup Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Set Up Your Laptop</PageTitle>
                <SubTitle>Register your laptop to get started</SubTitle>

                <Formik
                    initialValues={{ brand: '', model: '' }}
                    validationSchema={SetupSchema}
                    onSubmit={handleSetup}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="Brand"
                                icon="device-desktop"
                                placeholder="Enter laptop brand (e.g. Dell, HP)"
                                onChangeText={handleChange('brand')}
                                onBlur={handleBlur('brand')}
                                value={values.brand}
                            />
                            {touched.brand && errors.brand && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.brand}</Text>
                        )}
                            <MyTextInput
                                label="Model"
                                icon="cpu"
                                placeholder="Enter laptop model"
                                onChangeText={handleChange('model')}
                                onBlur={handleBlur('model')}
                                value={values.model}
                            />
                            {touched.model && errors.model && (<Text style={{ color: 'red', fontSize: 12, marginBottom: 10}}>{errors.model}</Text>
                        )}

                            <StyledButton onPress={handleSubmit} disabled={isLoading}>
                                {isLoading ? (<ActivityIndicator size="small" color={primary}/>) : (<ButtonText>Register Laptop</ButtonText>)}
                            </StyledButton>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
};

export default SetUp;