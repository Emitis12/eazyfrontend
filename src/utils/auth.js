// src/utils/auth.js

/**
 * ===== Token Management (Multi-Role, Session-Aware) =====
 * Supports persistent (localStorage) and session (sessionStorage) tokens
 */

const ROLES = ["superAdmin", "admin", "vendor", "rider", "customer"];

/**
 * Set authentication token for a role
 * @param {string} role - Role name (superAdmin, admin, vendor, rider, customer)
 * @param {string} token - JWT or API token
 * @param {boolean} remember - Store in localStorage if true, else sessionStorage
 */
export function setAuthToken(role, token, remember = false) {
  const key = `${role}Token`;
  try {
    if (remember) {
      localStorage.setItem(key, token);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, token);
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
}

/**
 * Retrieve token for a specific role
 * @param {string} role
 * @returns {string|null}
 */
export function getAuthToken(role) {
  const key = `${role}Token`;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

/**
 * Remove stored token for a role
 * @param {string} role
 */
export function clearAuthToken(role) {
  const key = `${role}Token`;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

/**
 * Clear all tokens (logs out all users)
 */
export function logoutAll() {
  ROLES.forEach(clearAuthToken);
}

/**
 * Get active token among all roles
 * @returns {{ token: string|null, role: string|null }}
 */
export function getActiveToken() {
  for (const role of ROLES) {
    const token = getAuthToken(role);
    if (token) return { token, role };
  }
  return { token: null, role: null };
}

/**
 * Check if any role is currently logged in
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getActiveToken().token;
}

/**
 * Get current user role based on stored token
 * @returns {string|null}
 */
export function getActiveRole() {
  const { role } = getActiveToken();
  return role;
}

/**
 * Log out currently active user (auto-detects role)
 */
export function logoutCurrent() {
  const { role } = getActiveToken();
  if (role) clearAuthToken(role);
}

/**
 * Utility: Clear all tokens if storage becomes corrupted
 */
export function resetAuthStorage() {
  try {
    ROLES.forEach((role) => {
      localStorage.removeItem(`${role}Token`);
      sessionStorage.removeItem(`${role}Token`);
    });
  } catch (error) {
    console.warn("Error clearing auth storage:", error);
  }
}

/**
 * Auto Sync Across Tabs
 * Logout if token is removed in another tab
 */
window.addEventListener("storage", (e) => {
  if (ROLES.map(r => `${r}Token`).includes(e.key) && !e.newValue) {
    logoutAll();
    window.location.href = "/login";
  }
});
