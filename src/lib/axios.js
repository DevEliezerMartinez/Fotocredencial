// src/lib/axios.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  withCredentials: true, // Necesario para cookies HTTP-Only
});

// Interceptor para FormData (multipart)
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Logs en desarrollo
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use((config) => {
    console.log("➡️ Request:", config.method?.toUpperCase(), config.url);
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      console.log("✅ Response:", response.status);
      return response;
    },
    (error) => {
      console.error("❌ Error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

export default apiClient;
