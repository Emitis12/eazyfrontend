// src/utils/api.js
import axios from "axios";
import { notify } from "../components/common/Notification";

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    notify.error("API Error", message);
    return Promise.reject(error);
  }
);

export default API;
