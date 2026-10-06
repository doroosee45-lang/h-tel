import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Adresse du backend. Sur téléphone physique, utiliser l'IP locale de la machine (pas localhost).
// Peut être surchargée avec la variable EXPO_PUBLIC_API_URL (ex: EXPO_PUBLIC_API_URL=http://192.168.1.20:5000 npx expo start).
const defaultApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || defaultApiUrl).replace(/\/+$/, '');
export const BASE_URL = `${API_URL}/api`;

export const STORAGE_KEYS = { access: 'shms_access_token', refresh: 'shms_refresh_token', user: 'shms_user' };

export async function getStoredToken(key) {
  const token = await SecureStore.getItemAsync(key);
  if (token) return token;

  const legacyToken = await AsyncStorage.getItem(key);
  if (legacyToken) {
    await SecureStore.setItemAsync(key, legacyToken);
    await AsyncStorage.removeItem(key);
  }
  return legacyToken;
}

export async function saveTokens({ accessToken, refreshToken }) {
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.access, accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.refresh, refreshToken),
  ]);
}

export async function clearStoredSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.access),
    SecureStore.deleteItemAsync(STORAGE_KEYS.refresh),
    AsyncStorage.multiRemove(Object.values(STORAGE_KEYS)),
  ]);
}

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

let onAuthFailure = null;
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken(STORAGE_KEYS.access);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes('/client-portal/login') || original?.url?.includes('/client-portal/register') || original?.url?.includes('/client-portal/refresh');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = (async () => {
            const refreshToken = await getStoredToken(STORAGE_KEYS.refresh);
            if (!refreshToken) throw new Error('no refresh token');
            const { data } = await axios.post(`${BASE_URL}/client-portal/refresh`, { refreshToken }, { timeout: 15000 });
            await SecureStore.setItemAsync(STORAGE_KEYS.access, data.data.accessToken);
            return data.data.accessToken;
          })().finally(() => {
            refreshing = null;
          });
        }
        const token = await refreshing;
        original.headers.Authorization = 'Bearer ' + token;
        return api(original);
      } catch (e) {
        if (onAuthFailure) onAuthFailure();
      }
    }
    return Promise.reject(error);
  }
);

// Message d'erreur lisible (réponse backend ou problème réseau)
export const errorMessage = (error) =>
  error?.response?.data?.message || (error?.request ? `Impossible de joindre le serveur (${API_URL})` : error?.message || 'Erreur inconnue');

export default api;
