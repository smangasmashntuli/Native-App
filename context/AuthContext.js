import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/apiService';

const AuthContext = createContext();

export const AuthProvide = ({ children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            await api.ping();
            setBackendAvailable(true);
            await checkAuthStatus();
        } catch (error) {
            console.error('Error initializing auth context:', error);
            setBackendAvailable(false);
            setError('Backend server is not available.');
        } finally {
            setLoading(false);
        }
    };

    const checkAuthStatus = async () => {
        try{
            const token = await AsyncStorage.getItem('access_token');
            if(token){
                try{
                    const userData = await api.getMe();
                    setUser(userData);
                    // Check setup status when app reloads
                    try {
                        const setupStatus = await api.getSetupStatus();
                        setNeedsSetup(setupStatus.needs_setup);
                    } catch (setupError) {
                        console.error('Error checking setup status:', setupError);
                        setNeedsSetup(true); // Assume needs setup on error
                    }
                } catch (error) {
                    await logout();
                }
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setLoading(false);
        }
    };

    const checkBackend = async () => {
        setLoading(true);
        try{
            await api.ping();
            setBackendAvailable(true);
            await checkAuthStatus();
        } catch (error) {
            console.error('Error checking backend availability:', error);
            setBackendAvailable(false);
            setError('Backend server is not available.');
            setLoading(false);
        }
    }

    const signup = async (userData) => {
        setError(null);
        try{
            const response = await api.signup(userData);
            return {success: true, data: response};
        } catch (error) {
            setError(error.message);
            return {success: false, error: error.message};
        }
    };

    const login = async (credentials) => {
        setError(null);
        try{
            const response = await api.login(credentials);
            await AsyncStorage.setItem('access_token', response.access_token);
            const userData = await api.getMe();
            setUser(userData);
            // Capture needs_setup from login response
            const needsSetupValue = response.needs_setup !== undefined ? response.needs_setup : true;
            setNeedsSetup(needsSetupValue);
            return {success: true, data: userData, needsSetup: needsSetupValue};
        } catch (error) {
            setError(error.message);
            return {success: false, error: error.message};
        }
    };

    const setup = async (laptopData) => {
        setError(null);
        try{
            const response = await api.setupLaptop(laptopData);
            setNeedsSetup(false);
            return {success: true, data: response};
        } catch (error) {
            setError(error.message);
            return {success: false, error: error.message};
        }
    }

    const logout = async () => {
        try{
            await AsyncStorage.removeItem('access_token');
            setUser(null);
            setNeedsSetup(true);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const value = {
        user,
        loading,
        error,
        backendAvailable,
        needsSetup,
        checkBackend,
        signup,
        login,
        setup,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};