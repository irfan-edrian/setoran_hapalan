import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { KC_URL, CLIENT_ID, CLIENT_SECRET } from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get('token'));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // You can fetch user info here if needed using the token

  const login = async (username, password) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'password');
      params.append('username', username);
      params.append('password', password);
      params.append('scope', 'openid profile email');

      const response = await axios.post(`${KC_URL}/realms/dev/protocol/openid-connect/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token, id_token } = response.data;
      
      Cookies.set('token', access_token, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', refresh_token, { expires: 7 });
      Cookies.set('id_token', id_token, { expires: 1 });
      
      setToken(access_token);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: error.response?.data?.error_description || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const idToken = Cookies.get('id_token');
      if (idToken) {
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('id_token_hint', idToken);
        
        await axios.post(`${KC_URL}/realms/dev/protocol/openid-connect/logout`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      }
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      Cookies.remove('id_token');
      setToken(null);
    }
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
