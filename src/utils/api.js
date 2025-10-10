// src/utils/api.js
import axios from "axios";
import { notify } from "../components/common/Notification";

/**
 * ===== Base API Setup =====
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ===== Role Tokens =====
 * Store/retrieve tokens separately for each user type
 */
export function setAdminToken(token) {
  if (token) localStorage.setItem("adminToken", token);
  else localStorage.removeItem("adminToken");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function setVendorToken(token) {
  if (token) localStorage.setItem("vendorToken", token);
  else localStorage.removeItem("vendorToken");
}

export function getVendorToken() {
  return localStorage.getItem("vendorToken");
}

export function setRiderToken(token) {
  if (token) localStorage.setItem("riderToken", token);
  else localStorage.removeItem("riderToken");
}

export function getRiderToken() {
  return localStorage.getItem("riderToken");
}

export function setCustomerToken(token) {
  if (token) localStorage.setItem("customerToken", token);
  else localStorage.removeItem("customerToken");
}

export function getCustomerToken() {
  return localStorage.getItem("customerToken");
}

/**
 * ===== Get Active Token (All Roles) =====
 */
export function getAuthToken() {
  return getAdminToken() || getVendorToken() || getRiderToken() || getCustomerToken();
}

/**
 * ===== Request Interceptor =====
 */
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ===== Response Interceptor =====
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401 || message.toLowerCase().includes("token")) {
      notify.error("Session Expired", "Please log in again.");
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status >= 500) {
      notify.error("Server Error", "Something went wrong on the server.");
    } else if (status >= 400) {
      notify.error("Request Error", message);
    } else {
      notify.error("API Error", message);
    }

    return Promise.reject(error);
  }
);

/**
 * ===== Generic API Helpers =====
 */
export const ApiHelper = {
  get: (url, params) => API.get(url, { params }).then((res) => res.data),
  post: (url, data) => API.post(url, data).then((res) => res.data),
  put: (url, data) => API.put(url, data).then((res) => res.data),
  patch: (url, data) => API.patch(url, data).then((res) => res.data),
  delete: (url) => API.delete(url).then((res) => res.data),
};

/**
 * ===== Orders API =====
 */
export const OrderAPI = {
  createOrder: (data) => API.post("/orders", data).then((res) => res.data),
  assignRider: (data) => API.post("/orders/assign-rider", data).then((res) => res.data),
  confirmPayment: (orderId) => API.patch(`/orders/${orderId}/confirm-payment`).then((res) => res.data),
  getOrders: (params) => API.get("/orders", { params }).then((res) => res.data),
  getActiveVendorOrders: () => API.get("/orders/vendor/active").then((res) => res.data),
  getActiveRiderOrders: (riderId) => API.get(`/orders/rider/active/${riderId}`).then((res) => res.data),
};

/**
 * ===== Users API =====
 */
export const UserAPI = {
  getProfile: () => API.get("/users/me").then((res) => res.data),
  updateProfile: (data) => API.put("/users/me", data).then((res) => res.data),
  login: (data) => API.post("/auth/login", data).then((res) => res.data),
  register: (data) => API.post("/auth/register", data).then((res) => res.data),
};

/**
 * ===== Vendors API =====
 */
export const VendorAPI = {
  getProducts: () => API.get("/products/vendor").then((res) => res.data),
  getOffers: () => API.get("/offers/vendor").then((res) => res.data),
  updateOffer: (offerId, data) => API.put(`/offers/${offerId}`, data).then((res) => res.data),
};

/**
 * ===== Riders API =====
 */
export const RiderAPI = {
  getTasks: (riderId) => API.get(`/riders/${riderId}/tasks`).then((res) => res.data),
  updateEarnings: (riderId, data) => API.patch(`/riders/${riderId}/earnings`, data).then((res) => res.data),
};

/**
 * ===== Chat API =====
 */
export const ChatAPI = {
  getChats: () => API.get("/chats").then((res) => res.data),
  sendMessage: (chatId, message) => API.post(`/chats/${chatId}/message`, { message }).then((res) => res.data),
  createChat: (participants) => API.post("/chats", { participants }).then((res) => res.data),
};

export default API;
