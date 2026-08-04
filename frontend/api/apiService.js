import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000';

const getToken = async () => {
    try{
        return await AsyncStorage.getItem('access_token');
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
};

const normalizeEndpoint = (endpoint) => {
    if (!endpoint) return '/';
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}


const api = {
    async request(endpoint, method = 'GET', data = null, requiresAuth = false) {
        const url = `${API_BASE_URL}${normalizeEndpoint(endpoint)}`;
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

    // === Authentication ===
    async signup(userData) {
        return this.request('signup/', 'POST', userData);
    },

    async login(credentials) {
        return this.request('login/', 'POST', credentials);
    },

    async getMe() {
        return this.request('me/', 'GET', null, true);
    },

    // === Laptop Setup ===
    async getSetupStatus() {
        return this.request('setup/status/', 'GET', null, true);
    },

    async setupLaptop(laptopData) {
        return this.request('setup/', 'POST', laptopData, true);
    },

    async ingestLaptopSpecs(brand, model) {
        return this.request('laptop/specs/ingest/', 'POST', { brand, model_name: model }, true);
    },

    // === 3D Model & Components ===
    async getLaptop3DModel(laptopId) {
        return this.request(`laptop/${laptopId}/3d-model/`, 'GET', null, true);
    },

    async explainComponent(payload) {
        return this.request('chat/explain-component/', 'POST', payload, true);
    },

    // === Chat ===
    async sendMessage(message, sessionId = null) {
        const payload = {
            user_id: null, // Backend gets this from auth token
            session_id: sessionId,
            message,
        };
        return this.request('chat/message/', 'POST', payload, true);
    },

    async getChatHistory(sessionId) {
        return this.request(`chat/history/${sessionId}/`, 'GET', null, true);
    },

    // === Notifications ===
    async getNotifications(unreadOnly = false) {
        const endpoint = unreadOnly ? 'notifications/?unread_only=true' : 'notifications/';
        return this.request(endpoint, 'GET', null, true);
    },

    async markNotificationRead(notificationId) {
        return this.request(`notifications/${notificationId}/read/`, 'PATCH', null, true);
    },

    async triggerMaintenance() {
        return this.request('notifications/trigger-maintenance/', 'POST', null, true);
    },

    // === YouTube Videos ===
    async searchVideos(brand, model, issue) {
        const params = new URLSearchParams({ brand, model, issue });
        return this.request(`videos/search/?${params.toString()}`, 'GET', null, true);
    },

    // === Health Check ===
    async ping() {
        return this.request('ping/', 'GET');
    }

};

export default api;