import { createContext, useMemo, useState } from 'react';
import {
  rooms as initialRooms,
  reservations as initialReservations,
  paymentMethods,
  payments as initialPayments,
  notifications as initialNotifications,
  auditLogs as initialAuditLogs,
  portalClient
} from '../data/mockData.js';

export const AppContext = createContext(null);

/**
 * Fournisseur global de l'application Smart Hotel 360°.
 * - Gère l'authentification/rôle (Super Admin, Manager, Client)
 * - Centralise le panier, les réservations, chambres, paiements, notifications
 * - Expose des helpers (addAuditLog, addNotification) pour tracer les actions
 */
export function AppProvider({ children }) {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('sh_role') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sh_user') || 'null');
    } catch {
      return null;
    }
  });
  const isAuthenticated = !!userRole && !!currentUser;

  const [cartItems, setCartItems] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservations, setReservations] = useState(initialReservations);
  const [rooms, setRooms] = useState(initialRooms);
  const [payments, setPayments] = useState(initialPayments);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0] || 'Espèces');

  // Espace client (démonstration — client connecté = C001)
  const [clientOrders, setClientOrders] = useState([]);
  const [clientActivities, setClientActivities] = useState([]);
  const [clientInvoices, setClientInvoices] = useState([]);

  const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0), [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i));
      }
      return [...prev, { ...item, quantite: 1 }];
    });
  };

  const updateCartItem = (id, quantite) => {
    setCartItems((prev) => prev
      .map((item) => (item.id === id ? { ...item, quantite: Math.max(1, quantite) } : item))
      .filter((item) => item.quantite > 0)
    );
  };

  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const reserveRoom = (room) => {
    setSelectedRoom(room);
  };

const login = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    localStorage.setItem('sh_role', role);
    localStorage.setItem('sh_user', JSON.stringify(user));
  };

  const logout = () => {
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('sh_role');
    localStorage.removeItem('sh_user');
  };

  const addAuditLog = (action, module = 'Système') => {
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('fr-FR'),
        user: currentUser?.nom || userRole,
        action,
        module,
        status: 'Réussi'
      },
      ...prev
    ]);
  };

  const addNotification = (titre, destinataire = 'Tous', canal = 'Push + Email') => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        titre,
        destinataire,
        canal,
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        statut: 'Envoyée'
      },
      ...prev
    ]);
  };

const value = {
    // Auth & rôles
    userRole,
    setUserRole,
    login,
    logout,
    isAuthenticated,
    currentUser,

    // Panier
    cartItems,
    cartSubtotal,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,

    // Chambres & réservations
    selectedRoom,
    reserveRoom,
    setSelectedRoom,
    reservations,
    setReservations,
    rooms,
    setRooms,

    // Paiements
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods,
    payments,
    setPayments,

    // Notifications & audit
    notifications,
    setNotifications,
    addNotification,
    auditLogs,
    setAuditLogs,
    addAuditLog,

    // Espace client
    portalClient,
    clientOrders,
    setClientOrders,
    clientActivities,
    setClientActivities,
    clientInvoices,
    setClientInvoices
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

