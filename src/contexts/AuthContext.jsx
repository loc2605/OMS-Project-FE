import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dọn dẹp localStorage cũ để tránh bị lỗi tự động đăng nhập từ các lần test trước
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Khởi tạo trạng thái đăng nhập từ sessionStorage (chỉ lưu trong một phiên làm việc)
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const login = (userData, token, refreshToken) => {
    setIsAuthenticated(true);
    setUser(userData);
    sessionStorage.setItem('isLoggedIn', 'true');
    if (token) sessionStorage.setItem('token', token);
    if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
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