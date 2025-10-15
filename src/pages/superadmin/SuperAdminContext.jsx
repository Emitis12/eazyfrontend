import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../../utils/api";
import { notify } from "../../components/common/Notification";

const SuperAdminContext = createContext(null);

export const useSuperAdmin = () => useContext(SuperAdminContext);

export function SuperAdminProvider({ children }) {
  const [stats, setStats] = useState({
    vendors: { total: 0, approved: 0, pending: 0 },
    riders: { total: 0, approved: 0, pending: 0 },
    customers: { total: 0 },
    products: { total: 0 },
    orders: { total: 0 },
  });

  const [pendingVendors, setPendingVendors] = useState([]);
  const [pendingRiders, setPendingRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch summary stats and pending lists
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [sRes, vRes, rRes] = await Promise.all([
        API.get("/superadmin/stats"),
        API.get("/superadmin/pending/vendors"),
        API.get("/superadmin/pending/riders"),
      ]);
      // expected shapes: sRes.data, vRes.data = [{...}], rRes.data = [{...}]
      setStats((prev) => ({ ...prev, ...(sRes?.data || {}) }));
      setPendingVendors(vRes?.data || []);
      setPendingRiders(rRes?.data || []);
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Failed fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Approve / Reject vendor
  const approveVendor = async (vendorId) => {
    try {
      await API.post(`/superadmin/vendors/${vendorId}/approve`);
      notify("Vendor approved", "Vendor approved successfully");
      // remove from pending list and update stats
      setPendingVendors((prev) => prev.filter((v) => v.id !== vendorId));
      setStats((prev) => ({
        ...prev,
        vendors: {
          ...prev.vendors,
          pending: Math.max(0, (prev.vendors.pending || 1) - 1),
          approved: (prev.vendors.approved || 0) + 1,
        },
      }));
      // optionally trigger verification email via backend on approve endpoint
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Approve failed");
    }
  };

  const rejectVendor = async (vendorId) => {
    try {
      await API.post(`/superadmin/vendors/${vendorId}/reject`);
      notify("Vendor rejected", "Vendor has been rejected");
      setPendingVendors((prev) => prev.filter((v) => v.id !== vendorId));
      setStats((prev) => ({
        ...prev,
        vendors: {
          ...prev.vendors,
          pending: Math.max(0, (prev.vendors.pending || 1) - 1),
          total: Math.max(0, (prev.vendors.total || 1) - 1),
        },
      }));
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Reject failed");
    }
  };

  const approveRider = async (riderId) => {
    try {
      await API.post(`/superadmin/riders/${riderId}/approve`);
      notify("Rider approved", "Rider approved successfully");
      setPendingRiders((prev) => prev.filter((r) => r.id !== riderId));
      setStats((prev) => ({
        ...prev,
        riders: {
          ...prev.riders,
          pending: Math.max(0, (prev.riders.pending || 1) - 1),
          approved: (prev.riders.approved || 0) + 1,
        },
      }));
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Approve failed");
    }
  };

  const rejectRider = async (riderId) => {
    try {
      await API.post(`/superadmin/riders/${riderId}/reject`);
      notify("Rider rejected", "Rider has been rejected");
      setPendingRiders((prev) => prev.filter((r) => r.id !== riderId));
      setStats((prev) => ({
        ...prev,
        riders: {
          ...prev.riders,
          pending: Math.max(0, (prev.riders.pending || 1) - 1),
          total: Math.max(0, (prev.riders.total || 1) - 1),
        },
      }));
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Reject failed");
    }
  };

  const suspendUser = async (userId, type /* 'customer'|'vendor'|'rider' */) => {
    try {
      await API.post(`/superadmin/users/${userId}/suspend`, { type });
      notify("User suspended", `${type} suspended successfully`);
      // update local stats minimally if needed
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Suspend failed");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await API.delete(`/superadmin/products/${productId}`);
      notify("Product deleted", "Product removed from marketplace");
      // you could update product counts in stats if tracked
      setStats((prev) => ({
        ...prev,
        products: {
          ...prev.products,
          total: Math.max(0, (prev.products.total || 1) - 1),
        },
      }));
    } catch (err) {
      notify("Error", err?.response?.data?.message || "Delete failed");
    }
  };

  const value = {
    stats,
    pendingVendors,
    pendingRiders,
    loading,
    fetchStats,
    approveVendor,
    rejectVendor,
    approveRider,
    rejectRider,
    suspendUser,
    deleteProduct,
  };

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>;
}
