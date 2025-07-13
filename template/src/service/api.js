const AUTHURL = "http://localhost:8080";
const ORDERURL = "http://localhost:8081";

import axios from "./axios-config";

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

export const callGetAllOrders = () => {
  return axios.get(ORDERURL + "/api/orders");
}

export const callGetOrderOfMe = () => {
  return axios.get(ORDERURL + `/api/orders/me`);
}

export const callCreateOrder = (productName, price, quantity, userId) => {
  return axios.post(ORDERURL + "/api/orders", { productName, price, quantity, userId });
};
