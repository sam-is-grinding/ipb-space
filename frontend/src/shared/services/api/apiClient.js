import axios from 'axios';

/**
 * Axios instance customized for IPB Space API
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Standard response: { success: boolean, data: any }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
             refresh_token: refreshToken
          });
          
          if (res.data && res.data.access_token) {
             localStorage.setItem('token', res.data.access_token);
             apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
             return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
         // Refresh failed, proceed to logout
      }
      
      // If no refresh token or refresh failed, logout
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
