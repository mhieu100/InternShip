import axios from "./axios-config";
import { API_ENDPOINTS, API_ROUTES } from '@/constants';

// user

export const callLogin = (username, password) => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.LOGIN, { username, password });
};

export const callRegister = (name, email, password) => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.REGISTER, { name, email, password });
};

export const callLogout = () => {
  return axios.post(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.REGISTER);
};

export const callProfile = () => {
  return axios.get(API_ENDPOINTS.AUTH + API_ROUTES.AUTH.PROFILE);
};

export const callAllUserForChat = () => {
  return axios.get(API_ENDPOINTS.AUTH + API_ROUTES.USERS.CHAT_USERS);
};

// orders

export const callGetAllOrders = () => {
  return axios.get(API_ENDPOINTS.ORDER + API_ROUTES.ORDERS.BASE);
};

export const callGetOrderOfMe = () => {
  return axios.get(API_ENDPOINTS.ORDER + API_ROUTES.ORDERS.ME);
};

export const callCreateOrder = (productName, price, quantity) => {
  return axios.post(API_ENDPOINTS.ORDER + API_ROUTES.ORDERS.BASE, { productName, price, quantity });
};

export const callCompleteOrder = (id) => {
  return axios.get(API_ENDPOINTS.ORDER + API_ROUTES.ORDERS.COMPLETE(id));
};

export const callCancelOrder = (id) => {
  return axios.get(API_ENDPOINTS.ORDER + API_ROUTES.ORDERS.CANCEL(id));
};

// chat

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

export const callCreateCamera = (name, location, streamUrl, status, type, quality, resolution, fps) => {
  return axios.post(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BASE, {
    name, location, streamUrl, status, type, quality, resolution, fps
  });
};

export const callGetAllCameras = () => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BASE);
};

export const callGetCameraById = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id));
}

export const callUpdateCamera = (id, name, location, streamUrl, status, type , quality, resolution, fps) => {
  return axios.put(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id), {
    name, location, streamUrl, status, type, quality, resolution, fps
  });
};

export const callDeleteCameras = (id) => {
  return axios.delete(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.BY_ID(id));
};

export const callCheckHealthCamera = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.HEALTH(id));
};

export const callDisconnectCameras = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.CAMERAS.DESTROY(id));
};

// === CAMERA STREAM APIs ===

export const callStartStream = (id, quality = "medium") => {
  return axios.post(
    API_ENDPOINTS.CAMERA + API_ROUTES.STREAM.START(id) + `?quality=${quality}`
  );
};

export const callStopStream = (id) => {
  return axios.delete(API_ENDPOINTS.CAMERA + API_ROUTES.STREAM.STOP(id));
};

export const callGetStreamStatus = (id) => {
  return axios.get(API_ENDPOINTS.CAMERA + API_ROUTES.STREAM.STATUS(id));
};

export const callGetStreamUrl = (id) => {
  return API_ENDPOINTS.CAMERA + API_ROUTES.STREAM.URL(id);
};

export const callGetStreamSegmentUrl = (id, segmentNumber) => {
  return API_ENDPOINTS.CAMERA + API_ROUTES.STREAM.SEGMENT(id, segmentNumber);
};
