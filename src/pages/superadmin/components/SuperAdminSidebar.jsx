import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardCheck,
  FaBoxOpen,
  FaUserTimes,
  FaComments,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/superadmin/dashboard" },
  { name: "Vendor Approvals", icon: <FaClipboardCheck />, path: "/superadmin/vendors" },
  { name: "Rider Approvals", icon: <FaUsers />, path: "/superadmin/riders" },
  { name: "Product Moderation", icon: <FaBoxOpen />, path: "/superadmin/products" },
  { name: "User Management", icon: <FaUserTimes />, path: "/superadmin/users" },
  { name: "Complaints", icon: <FaComments />, path: "/superadmin/complaints" },
  { name: "Settings", icon: <FaCog />, path: "/superadmin/settings" },
];

export default function SuperAdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("superToken");
    navigate("/superadmin/login");
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-[#008BE0] to-[#00C2FF] text-white flex flex-col py-6 shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wide">Eazy Admin</h1>
        <p className="text-xs text-white/80">Control Panel</p>
      </div>

      <nav className="flex-1 space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-5 py-3 rounded-l-full transition-all duration-300 ${
                isActive ? "bg-white text-[#008BE0] shadow-md" : "hover:bg-white/20"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 w-full text-sm hover:bg-white/20 transition-all rounded-md"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
