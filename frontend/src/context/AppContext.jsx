import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api, unwrap } from '../api/client.js';
import { connectSocket, disconnectSocket } from '../api/socket.js';
import {
  buildSession,
  clearSession,
  getHomePath,
  getRoleGroup,
  getRoleLabel,
  getSession,
  getUserRole,
  isClientSession,
  saveSession
} from '../utils/auth.js';

export const AppContext = createContext(null);

const PAYMENT_METHODS = ['Espèces', 'Carte', 'M-Pesa', 'Orange Money', 'Virement'];

function getSocketChannels(session) {
  if (!session?.user?.id) return [];
  if (isClientSession(session)) {
    return [session.user.id];
  }

  const role = session.user.role;
  const channels = [session.user.id, 'dashboard'];

  if (['restaurant_manager', 'waiter'].includes(role)) channels.push('kitchen');
  if (role === 'barman') channels.push('bar');
  if (['admin', 'receptionist'].includes(role)) channels.push('concierge');

  return [...new Set(channels)];
}

function mapNotification(notification) {
  if (!notification) return notification;
  return {
    ...notification,
    id: notification._id || notification.id,
    statut: notification.isRead ? 'Lue' : 'Non lue',
    heure: notification.createdAt
  };
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [currentUser, setCurrentUser] = useState(() => getSession()?.user || null);
  const [notifications, setNotifications] = useState([]);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [cartItems, setCartItems] = useState([]);
  const [clientOrders, setClientOrders] = useState([]);
  const [clientActivities, setClientActivities] = useState([]);
  const [clientInvoices, setClientInvoices] = useState([]);

  const syncSession = useCallback((nextSession) => {
    setSession(nextSession);
    setCurrentUser(nextSession?.user || null);
  }, []);

  const fetchCurrentUser = useCallback(async (activeSession = getSession()) => {
    if (!activeSession?.accessToken) return null;

    const endpoint = isClientSession(activeSession) ? '/client-auth/me' : '/auth/me';
    const data = unwrap(await api.get(endpoint));
    const nextSession = {
      ...activeSession,
      user: {
        ...activeSession.user,
        ...data,
        id: data._id || data.id || activeSession.user?.id,
        role: isClientSession(activeSession) ? 'client' : data.role || activeSession.user?.role
      }
    };
    saveSession(nextSession);
    syncSession(nextSession);
    return nextSession.user;
  }, [syncSession]);

  const fetchNotifications = useCallback(async (activeSession = getSession()) => {
    if (!activeSession?.accessToken) {
      setNotifications([]);
      return [];
    }

    const endpoint = isClientSession(activeSession) ? '/client-portal/my-notifications' : '/notifications';
    const response = await api.get(endpoint);
    const data = unwrap(response) || [];
    const mapped = data.map(mapNotification);
    setNotifications(mapped);
    return mapped;
  }, []);

  const applySession = useCallback(async (nextSession) => {
    saveSession(nextSession);
    syncSession(nextSession);
    await Promise.allSettled([fetchCurrentUser(nextSession), fetchNotifications(nextSession)]);
  }, [fetchCurrentUser, fetchNotifications, syncSession]);

  const loginStaff = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.twoFactorRequired) {
        setPendingTwoFactor({ email, pendingToken: response.data?.data?.pendingToken });
        return { twoFactorRequired: true };
      }

      const data = unwrap(response);
      const nextSession = buildSession({
        authType: 'staff',
        accessToken: data.accessToken,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        }
      });
      setPendingTwoFactor(null);
      await applySession(nextSession);
      return { success: true, user: nextSession.user, homePath: getHomePath(nextSession.user.role) };
    } finally {
      setAuthLoading(false);
    }
  }, [applySession]);

  const verifyStaffOtp = useCallback(async (code) => {
    if (!pendingTwoFactor?.pendingToken) {
      throw new Error('Aucune authentification en attente.');
    }

    setAuthLoading(true);
    try {
      const response = await api.post('/auth/2fa/verify-login', {
        pendingToken: pendingTwoFactor.pendingToken,
        code
      });
      const data = unwrap(response);
      const nextSession = buildSession({
        authType: 'staff',
        accessToken: data.accessToken,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        }
      });
      setPendingTwoFactor(null);
      await applySession(nextSession);
      return { success: true, user: nextSession.user, homePath: getHomePath(nextSession.user.role) };
    } finally {
      setAuthLoading(false);
    }
  }, [applySession, pendingTwoFactor]);

  const loginClient = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/client-auth/login', { email, password });
      const data = unwrap(response);
      const nextSession = buildSession({
        authType: 'client',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          loyaltyPoints: data.loyaltyPoints,
          vipStatus: data.vipStatus
        }
      });
      await applySession(nextSession);
      return { success: true, user: nextSession.user, homePath: getHomePath(nextSession.user.role) };
    } finally {
      setAuthLoading(false);
    }
  }, [applySession]);

  const registerClient = useCallback(async (payload) => {
    const response = await api.post('/client-auth/register', payload);
    const data = unwrap(response);
    const nextSession = buildSession({
      authType: 'client',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      }
    });
    await applySession(nextSession);
    return { success: true, user: nextSession.user, homePath: getHomePath(nextSession.user.role) };
  }, [applySession]);

  const logout = useCallback(async () => {
    const activeSession = getSession();
    try {
      if (activeSession?.accessToken) {
        const endpoint = isClientSession(activeSession) ? '/client-auth/logout' : '/auth/logout';
        await api.post(endpoint, {});
      }
    } catch {
      // best effort
    } finally {
      disconnectSocket();
      clearSession();
      syncSession(null);
      setNotifications([]);
      setPendingTwoFactor(null);
    }
  }, [syncSession]);

  const markNotificationRead = useCallback(async (id) => {
    const endpoint = isClientSession(session)
      ? `/client-portal/my-notifications/${id}/read`
      : `/notifications/${id}/read`;
    await api.patch(endpoint);
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true, statut: 'Lue' } : item)));
  }, [session]);

  const login = useCallback(async (roleOrPayload, maybeUser) => {
    if (typeof roleOrPayload === 'string' && maybeUser) {
      const authType = roleOrPayload === 'client' ? 'client' : 'staff';
      const nextSession = buildSession({ authType, accessToken: null, user: maybeUser });
      syncSession(nextSession);
      saveSession(nextSession);
      return;
    }

    if (roleOrPayload?.authType === 'client') {
      return loginClient(roleOrPayload);
    }

    return loginStaff(roleOrPayload);
  }, [loginClient, loginStaff, syncSession]);

  useEffect(() => {
    const handleClear = () => {
      disconnectSocket();
      syncSession(null);
      setNotifications([]);
    };

    window.addEventListener('sh-auth-cleared', handleClear);
    return () => window.removeEventListener('sh-auth-cleared', handleClear);
  }, [syncSession]);

  useEffect(() => {
    if (!session?.accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket({
      token: session.accessToken,
      channels: getSocketChannels(session),
      onNotification: (payload) => {
        const item = mapNotification(payload);
        setNotifications((prev) => [item, ...prev.filter((existing) => existing.id !== item.id)]);
      },
      onOrderEvent: () => {
        // pages can refetch on navigation; keeping hook lightweight here
      }
    });

    return () => socket?.disconnect();
  }, [session]);

  useEffect(() => {
    if (!session?.accessToken) return;
    fetchCurrentUser().catch((error) => {
      if (error?.response?.status === 401) logout();
    });
    fetchNotifications().catch(() => {});
  }, [fetchCurrentUser, fetchNotifications, logout, session?.accessToken, session?.authType, session?.user?.id]);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) => (entry.id === item.id ? { ...entry, quantite: entry.quantite + 1 } : entry));
      }
      return [...prev, { ...item, quantite: 1 }];
    });
  }, []);

  const updateCartItem = useCallback((id, quantite) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantite } : item)).filter((item) => item.quantite > 0));
  }, []);

  const removeCartItem = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);
  const reserveRoom = useCallback((room) => setSelectedRoom(room), []);
  const addAuditLog = useCallback((action, module = 'Système') => {
    setAuditLogs((prev) => [{ id: Date.now(), action, module, timestamp: new Date().toISOString(), status: 'Réussi' }, ...prev]);
  }, []);
  const addNotification = useCallback((title, destinataire = 'Système', canal = 'Socket.io') => {
    setNotifications((prev) => [{ id: Date.now(), title, destinataire, canal, isRead: false, statut: 'Non lue', createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const userRole = getUserRole(session);
  const userRoleLabel = getRoleLabel(userRole);
  const userRoleGroup = getRoleGroup(userRole);
  const isAuthenticated = Boolean(session?.accessToken);
  const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.prix || item.unitPrice || 0) * item.quantite, 0), [cartItems]);

  const value = useMemo(() => ({
    session,
    authType: session?.authType || null,
    currentUser,
    userRole,
    userRoleLabel,
    userRoleGroup,
    homePath: getHomePath(userRole),
    isAuthenticated,
    authLoading,
    pendingTwoFactor,
    login,
    loginStaff,
    loginClient,
    registerClient,
    verifyStaffOtp,
    logout,
    fetchCurrentUser,
    fetchNotifications,
    notifications,
    setNotifications,
    markNotificationRead,
    addNotification,
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    reserveRoom,
    reservations,
    setReservations,
    payments,
    setPayments,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods: PAYMENT_METHODS,
    auditLogs,
    setAuditLogs,
    addAuditLog,
    cartItems,
    cartSubtotal,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    portalClient: currentUser,
    clientOrders,
    setClientOrders,
    clientActivities,
    setClientActivities,
    clientInvoices,
    setClientInvoices
  }), [
    addAuditLog,
    addNotification,
    addToCart,
    auditLogs,
    authLoading,
    cartItems,
    cartSubtotal,
    clearCart,
    clientActivities,
    clientInvoices,
    clientOrders,
    currentUser,
    fetchCurrentUser,
    fetchNotifications,
    isAuthenticated,
    login,
    loginClient,
    loginStaff,
    logout,
    markNotificationRead,
    notifications,
    payments,
    pendingTwoFactor,
    registerClient,
    removeCartItem,
    reservations,
    reserveRoom,
    rooms,
    selectedPaymentMethod,
    selectedRoom,
    session,
    updateCartItem,
    userRole,
    userRoleGroup,
    userRoleLabel,
    verifyStaffOtp
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
