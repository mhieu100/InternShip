// API Base URLs
export const API_ENDPOINTS = {
  AUTH: "http://localhost:8080",
  ORDER: "http://localhost:8081", 
  CHAT: "http://localhost:8085",
  CAMERA: "http://localhost:8083",
};

// API Routes
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register", 
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/account",
    REFRESH: "/api/auth/refresh"
  },
  
  // User routes
  USERS: {
    CHAT_USERS: "/api/users/chat"
  },
  
  // Order routes
  ORDERS: {
    BASE: "/api/orders",
    ME: "/api/orders/me",
    COMPLETE: (id) => `/api/orders/${id}/complete`,
    CANCEL: (id) => `/api/orders/${id}/cancel`
  },
  
  // Chat routes
  CHAT: {
    CREATE_SINGLE: "/api/conversations/create-single",
    CREATE_GROUP: "/api/conversations/create-group", 
    MY_CONVERSATIONS: "/api/conversations/my-conversations",
    SEND_MESSAGE: "/api/messages/create",
    GET_MESSAGES: "/api/messages"
  },
  
  // Camera routes
  CAMERAS: {
    BASE: "/api/cameras",
    BY_ID: (id) => `/api/cameras/${id}`,
    STATUS: (id) => `/api/cameras/${id}/status`,
    DESTROY: (id) => `/destroy/${id}`,
    HEALTH: (id) => `/api/cameras/${id}/health`,
  },
  
  // Stream routes
  STREAM: {
    START: (id) => `/api/stream/${id}/start`,
    STOP: (id) => `/api/stream/${id}/stop`, 
    STATUS: (id) => `/api/stream/${id}/status`,
    URL: (id) => `/api/stream/${id}/index.m3u8`,
    SEGMENT: (id, segmentNumber) => `/api/stream/${id}/segment_${segmentNumber}.ts`
  }
};