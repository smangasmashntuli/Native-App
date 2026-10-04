import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import GradientButton from '../components/GradientButton';
import { FadeInDown } from '../components/animated';

const BackendDown = () => {
    const { checkBackend, error } = useAuth();

    return (
        <View style={styles.container}>
            <FadeInDown delay={60} distance={24}>
                <View style={styles.iconWrap}>
                    <Feather name="wifi-off" size={30} color="#FFD52C" />
                </View>
            </FadeInDown>

            <FadeInDown delay={160}>
                <Text style={styles.title}>Backend Unavailable</Text>
            </FadeInDown>

            <FadeInDown delay={260}>
                <Text style={styles.message}>
                    {error || 'Cannot reach backend server. Please ensure the backend is running.'}
                </Text>
            </FadeInDown>

            <FadeInDown delay={360}>
                <GradientButton label="Retry" onPress={() => checkBackend()} style={{ marginTop: 8 }} />
            </FadeInDown>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0E0F11',
    },
    iconWrap: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#17191D',
        borderWidth: 1,
        borderColor: '#23272C',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: '#8A9099',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default BackendDown;
