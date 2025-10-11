// src/utils/authEvents.js
const AUTH_EVENT = "auth-change";

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const listenAuthChange = (callback) => {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
};
