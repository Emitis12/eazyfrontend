// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// 🏠 Common Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

// 👤 User Pages
import UserDashboard from "../pages/user/Dashboard";
import Orders from "../pages/user/Orders";
import Wishlist from "../pages/user/Wishlist";
import Profile from "../pages/user/Profile";
import Marketplace from "../pages/user/Marketplace";
import SendParcel from "../pages/user/SendParcel";

// 🛍️ Vendor Pages
import VendorDashboard from "../pages/vendor/Dashboard";
import VendorOrders from "../pages/vendor/Orders";
import Products from "../pages/vendor/Products";
import Offers from "../pages/vendor/Offers";

// 🚴 Rider Pages
import RiderDashboard from "../pages/rider/Dashboard";
import DeliveryTasks from "../pages/rider/DeliveryTasks";
import Earnings from "../pages/rider/Earnings";

// 👨‍💼 Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Vendors from "../pages/admin/Vendors";
import Riders from "../pages/admin/Riders";
import Reports from "../pages/admin/Reports";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ==========================
            USER ROUTES
        =========================== */}
        <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/user/wishlist" element={<Wishlist />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/marketplace" element={<Marketplace />} />
          <Route path="/user/send-parcel" element={<SendParcel />} />
        </Route>

        {/* ==========================
            VENDOR ROUTES
        =========================== */}
        <Route element={<ProtectedRoute allowedRoles={["Vendor"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/products" element={<Products />} />
          <Route path="/vendor/offers" element={<Offers />} />
        </Route>

        {/* ==========================
            RIDER ROUTES
        =========================== */}
        <Route element={<ProtectedRoute allowedRoles={["Rider"]} />}>
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/tasks" element={<DeliveryTasks />} />
          <Route path="/rider/earnings" element={<Earnings />} />
        </Route>

        {/* ==========================
            ADMIN ROUTES
        =========================== */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/vendors" element={<Vendors />} />
          <Route path="/admin/riders" element={<Riders />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
