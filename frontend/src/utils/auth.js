export const SESSION_STORAGE_KEY = 'sh_session';

export const STAFF_ROLES = [
  'admin',
  'receptionist',
  'restaurant_manager',
  'waiter',
  'barman',
  'accountant',
  'stock_manager',
  'hr_manager',
  'housekeeping',
  'technician',
  'employee'
];

export const ROLE_LABELS = {
  admin: 'Administrateur',
  receptionist: 'Réception',
  restaurant_manager: 'Restaurant',
  waiter: 'Serveur',
  barman: 'Bar',
  accountant: 'Comptabilité',
  stock_manager: 'Stock',
  hr_manager: 'Ressources humaines',
  housekeeping: 'Housekeeping',
  technician: 'Technique',
  employee: 'Employé',
  client: 'Client'
};

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('sh-auth-changed', { detail: session }));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('sh-auth-cleared'));
}

export function getAuthType(session = getSession()) {
  return session?.authType || null;
}

export function getUserRole(session = getSession()) {
  return session?.user?.role || (session?.authType === 'client' ? 'client' : null);
}

export function isClientSession(session = getSession()) {
  return getAuthType(session) === 'client';
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || 'Invité';
}

export function getRoleGroup(role) {
  if (role === 'client') return 'client';
  if (role === 'admin') return 'admin';
  return 'manager';
}

export function getHomePath(role = getUserRole()) {
  if (role === 'client') return '/client';
  if (role === 'admin') return '/dashboard';
  if (role) return '/manager';
  return '/login';
}

export function hasAnyRole(role, allowedRoles = []) {
  if (!role) return false;
  return allowedRoles.includes(role);
}

export function buildSession({ authType, user, accessToken, refreshToken = null }) {
  return {
    authType,
    accessToken,
    refreshToken,
    user: {
      ...user,
      role: authType === 'client' ? 'client' : user.role
    }
  };
}
