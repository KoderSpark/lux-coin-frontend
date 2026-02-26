import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // If we're calling an admin route, use admin token
        if (config.url.includes('/admin')) {
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
            }
        } else {
            // For user portal protected routes, use session token
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                config.headers.Authorization = `Bearer ${sessionToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
