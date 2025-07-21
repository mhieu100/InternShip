const AUTHURL = "http://localhost:8080";
const ORDERURL = "http://localhost:8081";
const CHATURL = "http://localhost:8085";
const CAMERAURL = "http://localhost:8083";

import axios from "./axios-config";

// user

export const callLogin = (username, password) => {
  return axios.post(AUTHURL + "/api/auth/login", { username, password });
};

export const callRegister = (name, email, password) => {
  return axios.post(AUTHURL + "/api/auth/register", { name, email, password });
};

export const callLogout = () => {
  return axios.post(AUTHURL + "/api/auth/logout");
};

export const callProfile = () => {
  return axios.get(AUTHURL + "/api/auth/account");
};

// orders

export const callGetAllOrders = () => {
  return axios.get(ORDERURL + "/api/orders");
};

export const callGetOrderOfMe = () => {
  return axios.get(ORDERURL + `/api/orders/me`);
};

export const callCreateOrder = (productName, price, quantity) => {
  return axios.post(ORDERURL + "/api/orders", { productName, price, quantity });
};

export const callCompleteOrder = (id) => {
  return axios.get(ORDERURL + `/api/orders/${id}/complete`);
};

export const callCancelOrder = (id) => {
  return axios.get(ORDERURL + `/api/orders/${id}/cancel`);
};

// chat

export const callMyConversations = () => {
  return axios.get(CHATURL + "/api/conversations/my-conversations");
};

export const callSendMessage = (conversationId, message) => {
  return axios.post(CHATURL + "/api/messages/create", {
    conversationId,
    message,
  });
};

export const callGetMessages = (conversationId) => {
  return axios.get(CHATURL + `/api/messages?conversationId=${conversationId}`);
};

// camera

export const callCreateCamera = (
  name,
  ipAddress,
  location,
  resolution,
  fps,
  status
) => {
  return axios.post(CAMERAURL + "/api/cameras", {
    name,
    ipAddress,
    location,
    resolution,
    fps,
    status,
  });
};

export const callGetAllCameras = () => {
  return axios.get(CAMERAURL + "/api/cameras");
};

export const callUpdateCamera = (
  id,
  name,
  ipAddress,
  location,
  resolution,
  fps,
  status
) => {
  return axios.put(CAMERAURL + `/api/cameras/${id}`, {
    name,
    ipAddress,
    location,
    resolution,
    fps,
    status,
  });
};

export const callDeleteCameras = (id) => {
  return axios.delete(CAMERAURL + `/api/cameras/${id}`);
};


export const callDisconnectCameras = (id) => {
  return axios.get(CAMERAURL + `/api/cameras/destroy/${id}`);
};