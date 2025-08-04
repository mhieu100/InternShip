import axios from "./axios-config";
import { API_ENDPOINTS, API_ROUTES } from '@/constants';

// === User / Auth APIs ===

export const callLogin = (username, password) => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.LOGIN, { username, password });
};

export const callRegister = (name, email, password) => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.REGISTER, { name, email, password });
};

export const callLogout = () => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.LOGOUT);
};

export const callProfile = () => {
  return axios.get(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.PROFILE);
};

export const callAllUserForChat = () => {
  return axios.get(API_ENDPOINTS.AUTH + API_ROUTES.USERS.CHAT_USERS);
};

export const callUpdateProfile = (id, name, address) => {
  return axios.put(API_ENDPOINTS.AUTH + API_ROUTES.USERS.BY_ID(id), { name, address });
};

// === Chat APIs ===

export const callCreateSingleChat = (participantId) => {
  return axios.post(API_ENDPOINTS.CHAT + API_ROUTES.CHAT.CREATE_SINGLE, {
    participantId,
  });
};


export const callCreateGroupChat = (conversationName, participantIds) => {
  return axios.post(
    API_ENDPOINTS.CHAT + API_ROUTES.CHAT.CREATE_GROUP,
    { conversationName, participantIds }
  );
};

export const callMyConversations = () => {
  return axios.get(API_ENDPOINTS.CHAT + API_ROUTES.CHAT.MY_CONVERSATIONS);
};

export const callSendMessage = (conversationId, message) => {
  return axios.post(
    API_ENDPOINTS.CHAT + API_ROUTES.CHAT.SEND_MESSAGE,
    { conversationId, message }
  );
};

export const callGetMessages = (conversationId) => {
  return axios.get(
    API_ENDPOINTS.CHAT + API_ROUTES.CHAT.GET_MESSAGES + `?conversationId=${conversationId}`
  );
};

// === CAMERA APIs ===

export const callCreateCamera = (name, location, streamUrl, type, isPublic) => {
  console.log(isPublic)
  return axios.post(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BASE, {
    name, location, streamUrl, type, isPublic
  });
};

export const callGetAllCameras = () => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BASE);
};

export const callGetCameraById = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id));
}

export const callUpdateCamera = (id, name, location, streamUrl, type, isPublic) => {
  return axios.put(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id), {
    name, location, streamUrl, type, isPublic
  });
};

export const callDeleteCameras = (id) => {
  return axios.delete(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id));
};

// === Health APIs ===

export const callCheckHealthCamera = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.HEALTH.BY_ID(id));
};


export const callSaveCheckCamera = (historyData) => {
  return axios.post(API_ENDPOINTS.CAMERA + API_ROUTES.HEALTH.HISTORY, historyData);
};

export const callGetHealthCheck = () => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.HEALTH.HISTORY);
};


export const callScreenShot = (cameraId) => {
  return axios.post(API_ENDPOINTS.CAMERA + API_ROUTES.HEALTH.SCREEN_SHOT(cameraId));
};