export * from './api';

// App constants
export const APP_CONFIG = {
  NAME: "Camera Management System",
  VERSION: "1.0.0"
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token"
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  VIP_USER: "vip_user", 
  REGULAR_USER: "regular_user"
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};