import { API_BASE_URL } from '@/runtime-config';
import axios from 'axios';
import useAuth from './hooks/use-auth';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      useAuth.removeToken();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
