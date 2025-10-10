// src/utils/auth.js
export function setAuthToken(role, token, remember = false) {
  const key = `${role}Token`;
  if (remember) localStorage.setItem(key, token);
  else sessionStorage.setItem(key, token);
}

export function getAuthToken(role) {
  return localStorage.getItem(`${role}Token`) || sessionStorage.getItem(`${role}Token`);
}

export function clearAuthToken(role) {
  localStorage.removeItem(`${role}Token`);
  sessionStorage.removeItem(`${role}Token`);
}

export function logoutAll() {
  ["customer", "vendor", "rider", "admin"].forEach(clearAuthToken);
}
