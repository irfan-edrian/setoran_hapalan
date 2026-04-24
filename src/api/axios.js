import axios from 'axios';
import Cookies from 'js-cookie';

export const API_URL = 'https://api.tif.uin-suska.ac.id/setoran-dev/v1';
export const KC_URL = 'https://id.tif.uin-suska.ac.id';
export const CLIENT_ID = 'setoran-mobile-dev';
export const CLIENT_SECRET = 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor to handle 401 Unauthorized (refresh token logic can be added here)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      Cookies.remove('id_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
