import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const BackendDown = () => {
    const { checkBackend, error } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Backend Unavailable</Text>
            <Text style={styles.message}>{error || 'Cannot reach backend server. Please ensure the backend is running.'}</Text>
            <Button title="Retry" onPress={() => checkBackend()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    message: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
});

export default BackendDown;
