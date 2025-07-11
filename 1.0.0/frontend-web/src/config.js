// Backend API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9090/api';

// WebSocket configuration
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:9090/ws';

// Auth endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout'
};

// Other API endpoints
export const API_ENDPOINTS = {
  USERS: '/users',
  MESSAGES: '/messages',
  CHATS: '/chats'
};