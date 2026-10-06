import axios from 'axios';
import { clearSession, getSession, saveSession } from '../utils/auth.js';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const apiBaseUrl = `${rawBaseUrl.replace(/\/$/, '')}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

let refreshPromise = null;

function getRefreshConfig(session) {
  if (!session) return null;
  if (session.authType === 'client') {
    return {
      url: '/client-auth/refresh',
      body: { refreshToken: session.refreshToken }
    };
  }

  return {
    url: '/auth/refresh',
    body: session.refreshToken ? { refreshToken: session.refreshToken } : {}
  };
}

async function refreshAccessToken() {
  const session = getSession();
  const refreshConfig = getRefreshConfig(session);

  if (!session || !refreshConfig) {
    throw new Error('Aucune session active');
  }

  const response = await axios.post(`${apiBaseUrl}${refreshConfig.url}`, refreshConfig.body, {
    withCredentials: true
  });

  const nextSession = {
    ...session,
    accessToken: response.data?.data?.accessToken || session.accessToken
  };

  saveSession(nextSession);
  return nextSession.accessToken;
}

api.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.accessToken) {
    config.headers.Authorization = 'Bearer ' + session.accessToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const shouldTryRefresh = status === 401 && !originalRequest?._retry && getSession()?.accessToken;

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise || refreshAccessToken();
      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = 'Bearer ' + accessToken;
      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

export function unwrap(response) {
  return response?.data?.data;
}

export function getApiBaseUrl() {
  return rawBaseUrl.replace(/\/$/, '');
}
