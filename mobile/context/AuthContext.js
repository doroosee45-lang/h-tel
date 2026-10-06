import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { STORAGE_KEYS, clearStoredSession, getStoredToken, saveTokens, setAuthFailureHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearSession = useCallback(async () => {
    await clearStoredSession();
    setUser(null);
    setUnreadCount(0);
  }, []);

  const saveSession = async (data) => {
    await saveTokens(data);
  };

  // Restauration de la session au démarrage
  useEffect(() => {
    setAuthFailureHandler(clearSession);
    (async () => {
      try {
        const token = await getStoredToken(STORAGE_KEYS.access);
        if (token) {
          const { data } = await api.get('/client-portal/me');
          setUser(data.data);
        }
      } catch (e) {
        if (e?.response?.status === 401) await clearSession();
        else {
          const cached = await AsyncStorage.getItem(STORAGE_KEYS.user);
          if (cached) setUser(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [clearSession]);

  const fetchProfile = useCallback(async () => {
    const { data } = await api.get('/client-portal/me');
    setUser(data.data);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.data));
    return data.data;
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/client-portal/login', { email, password });
    await saveSession(data.data);
    await fetchProfile();
  };

  const register = async (form) => {
    const { data } = await api.post('/client-portal/register', form);
    await saveSession(data.data);
    await fetchProfile();
  };

  const logout = async () => {
    try {
      await api.post('/client-portal/logout');
    } catch (e) {
      // la session locale est supprimée même si le serveur est injoignable
    }
    await clearSession();
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put('/client-portal/me', updates);
    setUser(data.data);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.data));
    return data.data;
  };

  // Notifications: sondage périodique (pas de push FCM, voir README)
  const refreshUnread = useCallback(async () => {
    try {
      const { data } = await api.get('/client-portal/my-notifications');
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      // silencieux: sera retenté au prochain cycle
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    refreshUnread();
    const timer = setInterval(refreshUnread, 20000);
    return () => clearInterval(timer);
  }, [user, refreshUnread]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile, fetchProfile, unreadCount, refreshUnread }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, unreadCount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
