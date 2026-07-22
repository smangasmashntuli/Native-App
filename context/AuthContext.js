import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/apiService';

const AuthContext = createContext();

export const AuthProvide = ({ children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try{
            const token = await AsyncStorage.getItem('access_token');
            if(token){
                try{
                    const userData = await api.getMe();
                    setUser(userData);
                } catch (error) {
                    await logout();
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    };

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
            return {success: true, data: userData};
        } catch (error) {
            setError(error.message);
            return {success: false, error: error.message};
        }
    };

    const logout = async () => {
        try{
            await AsyncStorage.removeItem('access_token');
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
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

