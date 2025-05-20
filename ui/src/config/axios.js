import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

// Interceptor para añadir el token a cada solicitud
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para manejar errores 401
instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/admin'; // Redirige al login
    }
    return Promise.reject(error);
});

export default instance;