// src/utils/format.js
export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", { ...defaultOptions, ...options });
};

export const formatTime = (dateString, options = {}) => {
  const defaultOptions = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString("en-US", { ...defaultOptions, ...options });
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
