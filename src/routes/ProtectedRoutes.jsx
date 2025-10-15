import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  getAdminToken,
  getSuperAdminToken,
  getVendorToken,
  getRiderToken,
  getCustomerToken,
} from "../utils/api";

/**
 * 🔒 Unified Protected Route for all user roles.
 * - Redirects unauthenticated users to login.
 * - Prevents access to unauthorized roles.
 * - Now supports Super Admin role.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();

  // Fetch all possible tokens
  const tokens = {
    "Super Admin": getSuperAdminToken(),
    Admin: getAdminToken(),
    Vendor: getVendorToken(),
    Rider: getRiderToken(),
    Customer: getCustomerToken(),
  };

  // Determine active role based on which token exists
  const activeRole =
    Object.entries(tokens).find(([_, token]) => token)?.[0] || null;

  // ✅ If no active session — redirect to login
  if (!activeRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Role mismatch — not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access granted — render nested routes
  return <Outlet />;
}
