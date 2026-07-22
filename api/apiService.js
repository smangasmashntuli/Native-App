import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = '10.113.165.119';

const getToken = async () => {
    try{
        return await AsyncStorage.getItem('access_token');
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
};


const api = {
    async request(endpoint, method = 'GET', data = null, requiresAuth = false) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            const token = await getToken();
            if(token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                throw new Error('Authentication required');
            }
        }

        const config = {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        };

        try{
            const response = await fetch(url, config);
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.detail || 'API request failed');
            }
            return responseData;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }

        
    },

    async signup(userData) {
        return this.request('signup/', 'POST', userData);
    },

    async login(credentials) {
        return this.request('login/', 'POST', credentials);
    },

    async getMe() {
        return this.request('me/', 'GET', null, true);
    },

    async ping() {
        return this.request('ping/', 'GET');
    }

};

export default api;
