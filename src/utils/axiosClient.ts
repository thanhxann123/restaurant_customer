import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Gắn token vào header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Lấy token bàn (Guest)
    const tableToken = localStorage.getItem('table-session-token');
    
    // 2. Lấy token nhân viên (nếu sau này gộp app) hoặc token user khác
    const userToken = localStorage.getItem('access_token');

    if (config.headers) {
      // Ưu tiên 1: Nếu có token bàn, gửi qua header 'Table-Token' (Theo đúng logic AuthTokenFilter của Backend)
      if (tableToken) {
        config.headers['Table-Token'] = tableToken;
      }
      
      // Ưu tiên 2: Nếu có token user (Bearer), gửi qua Authorization
      // Lưu ý: Nếu App này chỉ dành cho Guest, userToken sẽ null, không ảnh hưởng.
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý dữ liệu và lỗi
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const errorData = error.response?.data as { message?: string } | undefined;
    const errorMessage = errorData?.message || error.message || 'Có lỗi xảy ra';
    
    // Log lỗi authentication để debug dễ hơn
    if (error.response?.status === 401) {
      console.warn('Authentication failed. Checking headers:', error.config?.headers);
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;