// src/utils/api.js
import axios from "axios";
import { notify } from "../components/common/Notification";

// ✅ Base API setup
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Helper to get the right token (supports multiple roles)
function getAuthToken() {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("riderToken")
  );
}

// ✅ Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (error & session handling)
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

// ✅ Generic helper functions
export const ApiHelper = {
  get: (url, params) => API.get(url, { params }).then((res) => res.data),
  post: (url, data) => API.post(url, data).then((res) => res.data),
  put: (url, data) => API.put(url, data).then((res) => res.data),
  patch: (url, data) => API.patch(url, data).then((res) => res.data),
  delete: (url) => API.delete(url).then((res) => res.data),
};

// ✅ Specialized API Endpoints
export const OrderAPI = {
  // 🧾 Create new order
  createOrder: (data) => API.post("/orders", data).then((res) => res.data),

  // 🚴 Assign a rider to an order
  assignRider: (data) =>
    API.post("/orders/assign-rider", data).then((res) => res.data),

  // 💵 Rider confirms payment (Pay-on-Delivery)
  confirmPayment: (orderId) =>
    API.patch(`/orders/${orderId}/confirm-payment`).then((res) => res.data),

  // 📦 Fetch user or rider orders
  getOrders: (params) =>
    API.get("/orders", { params }).then((res) => res.data),
};

// ✅ Default export for direct axios usage
export default API;
