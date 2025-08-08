// API Base URLs
export const API_ENDPOINTS = {
  AUTH: "http://localhost:8080",
  CHAT: "http://localhost:8085",
  CAMERA: "http://localhost:8083",
};

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/account",
    REFRESH: "/api/auth/refresh"
  },

  USERS: {
    BASE: "/api/users",
    BY_ID: (id) => `/api/users/${id}`,
    CHAT_USERS: "/api/users/chat"
  },

  CHAT: {
    CREATE_SINGLE: "/api/conversations/create-single",
    CREATE_GROUP: "/api/conversations/create-group",
    MY_CONVERSATIONS: "/api/conversations/my-conversations",
    SEND_MESSAGE: "/api/messages/create",
    GET_MESSAGES: "/api/messages"
  },

  CAMERAS: {
    BASE: "/api/cameras",
    BY_ID: (id) => `/api/cameras/${id}`,
  },

  HEALTH: {
    BASE: "/api/health",
    BY_ID: (id) => `/api/health/${id}`,
    HISTORY: "/api/health/history",
    SCREEN_SHOT: (id) => `/api/health/${id}/screen-shot`
  }

};