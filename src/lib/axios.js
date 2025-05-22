import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor JWT
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logs en desarrollo
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(config => {
    console.log('🚀 Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  });

  apiClient.interceptors.response.use(
    response => {
      console.log('✅ Response:', response.status, response.data);
      return response;
    },
    error => {
      console.error('❌ Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
}

export default apiClient;