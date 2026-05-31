import React, { createContext, useContext, useState, useEffect } from 'react';
import profileApi from '../api/profileApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Dọn dẹp localStorage cũ để tránh bị lỗi tự động đăng nhập từ các lần test trước
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // If we have a token (user may have reloaded or returned), fetch latest profile
    const init = async () => {
      const token = sessionStorage.getItem('token');
      const storedUserStr = sessionStorage.getItem('user');
      let storedUser = null;
      if (storedUserStr) {
        try { storedUser = JSON.parse(storedUserStr); } catch (_) { storedUser = null; }
      }
      if (token) {
        try {
          const res = await profileApi.getProfile();
          if (res && res.success) {
            // merge server profile with any stored user info (username etc.)
            const server = res.result || {};
            const merged = { ...server };
            // also preserve common name fields if server missing
            if (!merged.fullname && (storedUser?.fullname || storedUser?.fullName)) {
              merged.fullname = storedUser.fullname || storedUser.fullName;
            }
            setUser(merged);
            sessionStorage.setItem('user', JSON.stringify(merged));
            setIsAuthenticated(true);
          }
        } catch (e) {
          // ignore - keep existing session as-is
          console.error('Failed to refresh profile on init', e);
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        }
      } else if (storedUser) {
        // if no token but user stored (edge case), restore it
        setUser(storedUser);
      }
    };
    init();
  }, []);

  const login = async (userData, token, refreshToken) => {
    setIsAuthenticated(true);
    // store tokens first
    sessionStorage.setItem('isLoggedIn', 'true');
    if (token) sessionStorage.setItem('token', token);
    if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);

    // Try to fetch latest profile from server to ensure avatar and fields are fresh
    try {
      const res = await profileApi.getProfile();
      if (res && res.success) {
        const server = res.result || {};
        const merged = { ...server };
        if (!merged.fullname && (userData?.fullname || userData?.fullName)) merged.fullname = userData.fullname || userData.fullName;
        setUser(merged);
        sessionStorage.setItem('user', JSON.stringify(merged));
        return;
      }
    } catch (e) {
      // fallback to provided userData
      console.error('Failed to fetch profile after login', e);
    }

    setUser(userData);
    if (userData) sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};