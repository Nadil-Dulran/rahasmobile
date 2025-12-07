// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    // try load saved user
    (async()=>{
      const saved = await AsyncStorage.getItem('@rahas_user');
      if(saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    })();
  },[]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      const { user: u, token: t } = res.data;
      setUser(u);
      setToken(t);
      await AsyncStorage.setItem('@rahas_user', JSON.stringify({ user: u, token: t }));
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.response?.data?.message || err.message };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@rahas_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
// AuthContext provides authentication state and functions to the app.