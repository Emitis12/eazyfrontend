// src/utils/api.js
import axios from "axios";
import { notify } from "../components/common/Notification";
import { clearAuthToken, logoutAll } from "./auth";

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
 */
export function setSuperAdminToken(token) { if (token) localStorage.setItem("superAdminToken", token); else localStorage.removeItem("superAdminToken"); }
export function getSuperAdminToken() { return localStorage.getItem("superAdminToken"); }
export function setAdminToken(token) { if (token) localStorage.setItem("adminToken", token); else localStorage.removeItem("adminToken"); }
export function getAdminToken() { return localStorage.getItem("adminToken"); }
export function setVendorToken(token) { if (token) localStorage.setItem("vendorToken", token); else localStorage.removeItem("vendorToken"); }
export function getVendorToken() { return localStorage.getItem("vendorToken"); }
export function setRiderToken(token) { if (token) localStorage.setItem("riderToken", token); else localStorage.removeItem("riderToken"); }
export function getRiderToken() { return localStorage.getItem("riderToken"); }
export function setCustomerToken(token) { if (token) localStorage.setItem("customerToken", token); else localStorage.removeItem("customerToken"); }
export function getCustomerToken() { return localStorage.getItem("customerToken"); }

/**
 * ===== Get Active Token (All Roles) =====
 */
export function getAuthToken() {
  return (
    getSuperAdminToken() ||
    getAdminToken() ||
    getVendorToken() ||
    getRiderToken() ||
    getCustomerToken()
  );
}

/**
 * ===== Auto Sync Auth Across Tabs =====
 */
window.addEventListener("storage", (e) => {
  if (["superAdminToken","adminToken","vendorToken","riderToken","customerToken"].includes(e.key) && !e.newValue) {
    logoutAll();
    notify.info("Logged Out", "Your session has ended.");
    window.location.href = "/login";
  }
});

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

    if (status === 401 || (message && message.toLowerCase().includes("token"))) {
      logoutAll();
      notify.error("Session Expired", "Please log in again.");
      setTimeout(() => { window.location.href = "/login"; }, 800);
      return Promise.reject(error);
    }

    if (status >= 500) notify.error("Server Error", "Something went wrong on the server.");
    else if (status >= 400) notify.error("Request Error", message);
    else notify.error("API Error", message);

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
 * ===== Enhanced Mail Trigger Helper =====
 */
async function sendMailTrigger(email, subject, body, options = {}) {
  if (!email) return;
  try {
    let fullBody = body || "";
    if (options.onboardingLink) fullBody += `<p><a href="${options.onboardingLink}">Start Onboarding</a></p>`;
    await API.post("/mail/send", { to: email, subject, body: fullBody });
  } catch (err) {
    console.warn("Mail trigger failed:", err);
  }
}

/**
 * ===== Onboarding Reminder Helper =====
 */
export async function sendOnboardingReminders() {
  try {
    const pendingVendors = await API.get("/superadmin/vendors/pending-onboarding");
    const pendingRiders = await API.get("/superadmin/riders/pending-onboarding");

    for (const vendor of pendingVendors.data) {
      await sendMailTrigger(
        vendor.businessEmail,
        "Reminder: Complete Your Vendor Onboarding",
        `<h3>Hello ${vendor.name},</h3>
         <p>Your vendor account has been approved but you haven't completed onboarding yet.</p>
         <p>Please complete onboarding to start adding products and receiving orders.</p>`,
        { onboardingLink: `${import.meta.env.VITE_APP_URL}/vendor/dashboard` }
      );
    }

    for (const rider of pendingRiders.data) {
      await sendMailTrigger(
        rider.email,
        "Reminder: Complete Your Rider Onboarding",
        `<h3>Hello ${rider.name},</h3>
         <p>Your rider account has been approved but you haven't completed onboarding yet.</p>
         <p>Please complete onboarding to start receiving and managing deliveries.</p>`,
        { onboardingLink: `${import.meta.env.VITE_APP_URL}/rider/dashboard` }
      );
    }
  } catch (err) {
    console.warn("Failed to send onboarding reminders:", err);
  }
}

/**
 * ===== Users API =====
 */
export const UserAPI = {
  getProfile: () => API.get("/users/me").then((res) => res.data),
  updateProfile: (data) => API.put("/users/me", data).then((res) => res.data),
  login: (data) => API.post("/auth/login", data).then((res) => res.data),
  register: async (data) => {
    const res = await API.post("/auth/register", data);
    const email = res.data.user?.email;
    await sendMailTrigger(
      email,
      "Welcome to Eazy!",
      `<h3>Welcome to Eazy!</h3>
       <p>Your account has been created successfully.</p>
       <p>Please verify your email or use the OTP sent to complete registration.</p>`
    );
    return res.data;
  },
  sendOtp: async (data) => {
    const res = await API.post("/auth/send-otp", data);
    const email = data.email;
    await sendMailTrigger(
      email,
      "Your Eazy OTP",
      `<p>Your One-Time Password (OTP) is: <strong>${res.data.otp}</strong></p>`
    );
    return res.data;
  },
};

/**
 * ===== Super Admin API =====
 */
export const SuperAdminAPI = {
  login: (data) => API.post("/superadmin/login", data).then((res) => res.data),
  getAnalytics: () => API.get("/superadmin/analytics").then((res) => res.data),

  approveVendor: async (vendorId) => {
    const res = await API.patch(`/superadmin/vendors/${vendorId}/approve`);
    const email = res.data.vendor?.businessEmail;
    await sendMailTrigger(
      email,
      "Vendor Approved & Onboarding Complete",
      `<h3>Congratulations!</h3>
       <p>Your vendor account has been approved.</p>
       <p>You can now fully use the Eazy platform to manage products, view orders, and receive payments.</p>`,
      { onboardingLink: `${import.meta.env.VITE_APP_URL}/vendor/dashboard` }
    );
    return res.data;
  },

  approveRider: async (riderId) => {
    const res = await API.patch(`/superadmin/riders/${riderId}/approve`);
    const email = res.data.rider?.email;
    await sendMailTrigger(
      email,
      "Rider Approved & Onboarding Complete",
      `<h3>Congratulations!</h3>
       <p>Your rider account has been approved.</p>
       <p>You can now fully use the Eazy platform to receive and manage delivery tasks.</p>`,
      { onboardingLink: `${import.meta.env.VITE_APP_URL}/rider/dashboard` }
    );
    return res.data;
  },

  approveProduct: async (productId) => {
    const res = await API.patch(`/superadmin/products/${productId}/approve`);
    const email = res.data.product?.vendor?.businessEmail;
    await sendMailTrigger(
      email,
      "Product Approved & Live",
      `<p>Your product "${res.data.product.name}" has been approved and is now live on Eazy.</p>
       <p>You can now manage it from your vendor dashboard and start receiving orders.</p>`
    );
    return res.data;
  },
};

/**
 * ===== Manual Token Refresh =====
 */
export async function refreshToken(role, otpData) {
  try {
    const response = await API.post(`/auth/${role}/refresh-token`, otpData);
    const { token } = response.data;
    if (token) {
      localStorage.setItem(`${role}Token`, token);
      notify.success("Token Refreshed", "Your session has been renewed.");
      return token;
    }
  } catch (err) {
    notify.error("Token Refresh Failed", err.response?.data?.message || err.message);
    logoutAll();
    window.location.href = "/login";
  }
}

export default API;
