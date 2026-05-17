import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('access_token', token.access_token);
      localStorage.setItem('refresh_token', token.refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    }
    throw new Error('Login failed');
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (fullname, idnum, email) => {
    const response = await api.put('/users/me', { fullname, idnum, email });
    if (response.data.success) {
      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
    throw new Error('Update profile failed');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
