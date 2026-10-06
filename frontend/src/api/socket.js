import { io } from 'socket.io-client';
import { getApiBaseUrl } from './client.js';

let socket;

export function connectSocket({ token, channels = [], onNotification, onOrderEvent } = {}) {
  if (!token) return null;

  if (socket) {
    socket.disconnect();
  }

  socket = io(getApiBaseUrl(), {
    transports: ['websocket'],
    auth: { token }
  });

  socket.on('connect', () => {
    channels.filter(Boolean).forEach((channel) => socket.emit('join', channel));
  });

  if (onNotification) {
    socket.on('notification', onNotification);
  }

  if (onOrderEvent) {
    socket.on('order:new', onOrderEvent);
    socket.on('order:updated', onOrderEvent);
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
