import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      sessionStorage.removeItem('nexflow_token');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin({ username, password });
      if (data.token) {
        sessionStorage.setItem('nexflow_token', data.token);
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem('nexflow_token');
      localStorage.removeItem('nexflow_shift');
    }
  };


  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  const isShopAdmin = () => {
    return user?.role === 'shop_admin';
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isSuperAdmin, isShopAdmin, isCustomer, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    return {
      user: null,
      login: async () => {},
      logout: async () => {},
      isSuperAdmin: () => false,
      isShopAdmin: () => false,
      isCustomer: () => true,
      loading: false
    };
  }
  return context;
};
