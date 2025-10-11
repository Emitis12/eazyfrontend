import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export default function CommonSidebar({ links, role }) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(`${role}-sidebar-collapsed`);
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🧠 Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 💾 Save collapse state (desktop only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(`${role}-sidebar-collapsed`, JSON.stringify(collapsed));
    }
  }, [collapsed, role, isMobile]);

  const toggleMobileDrawer = () => setMobileOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          onClick={toggleMobileDrawer}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition"
        >
          <FaBars className="text-gray-700" size={20} />
        </button>
      )}

      {/* Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileDrawer}
        ></div>
      )}

      {/* === Sidebar === */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? "50%" : collapsed ? "5rem" : "16rem",
        }}
        transition={{ duration: 0.3 }}
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ${
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "bg-white shadow-md h-screen relative"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h2 className="font-bold text-lg text-blue-600 truncate">Eazy {role}</h2>}
          <button
            onClick={isMobile ? toggleMobileDrawer : () => setCollapsed((prev) => !prev)}
            className="text-gray-600 hover:text-blue-600"
          >
            {isMobile ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 overflow-y-auto ${
            isMobile
              ? "flex flex-col justify-center items-center gap-3"
              : "p-2"
          }`}
        >
          {links.map(({ label, path, icon: Icon, badge, onClick }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                if (onClick) onClick();
                if (isMobile) setMobileOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center ${
                  collapsed ? "justify-center" : "justify-start"
                } gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={20} />
              </motion.div>

              <AnimatePresence>
                {!collapsed && !isMobile && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex justify-between items-center"
                  >
                    {label}
                    {badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Mobile text center */}
              {isMobile && <span className="font-medium text-gray-800">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
