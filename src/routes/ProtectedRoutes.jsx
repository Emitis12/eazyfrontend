import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken, getVendorToken, getRiderToken, getCustomerToken } from "../utils/api"; 

/**
 * Centralized Protected Route for all user roles.
 * Redirects unauthenticated users to login,
 * and prevents access to unauthorized roles.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();

  // Pull all possible tokens
  const tokens = {
    Admin: getAdminToken(),
    Vendor: getVendorToken(),
    Rider: getRiderToken(),
    Customer: getCustomerToken(),
  };

  // Detect which user is logged in
  const activeRole = Object.entries(tokens).find(([_, token]) => token)?.[0] || null;

  // No token? Redirect to login
  if (!activeRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not allowed? Redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good, render nested routes
  return <Outlet />;
}
