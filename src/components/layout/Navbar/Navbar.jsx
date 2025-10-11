import { useState, useEffect } from "react";
import { Button, Badge } from "antd";
import { motion } from "framer-motion";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logowhite from "../../../assets/logowhite.png";
import { listenAuthChange } from "../../../utils/authEvents";

export default function Navbar({ notifications = [] }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ===== Scroll hide/show effect =====
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ===== Notifications badge =====
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // ===== Detect login state and username =====
  const checkAuth = () => {
    const admin = localStorage.getItem("adminToken");
    const vendor = localStorage.getItem("vendorToken");
    const rider = localStorage.getItem("riderToken");
    const customer = localStorage.getItem("customerToken");

    const user =
      localStorage.getItem("adminName") ||
      localStorage.getItem("vendorName") ||
      localStorage.getItem("riderName") ||
      localStorage.getItem("customerName");

    if (admin || vendor || rider || customer) {
      setIsLoggedIn(true);
      setUsername(user || "User");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  useEffect(() => {
    checkAuth();

    // React instantly to login/logout from anywhere
    const unsubscribe = listenAuthChange(checkAuth);

    // Also detect manual localStorage changes
    window.addEventListener("storage", checkAuth);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : -80,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.4 }}
      className="w-full sticky top-0 z-[9999] shadow-md backdrop-blur-sm"
      style={{
        background: "linear-gradient(90deg, #008BE0 50%, #FFCF71 50%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ===== Logo ===== */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={logowhite}
            alt="Eazy"
            className="w-25 h-11"
            whileHover={{ rotate: 10 }}
          />
        </Link>

        {/* ===== Right controls ===== */}
        <div className="flex items-center space-x-4">
          {/* Notifications for logged-in users */}
          {isLoggedIn && (
            <Badge count={unreadCount} offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined className="text-white text-lg" />}
                className="relative"
              />
            </Badge>
          )}

          {/* Username or Login button */}
          {isLoggedIn ? (
            <Button
              icon={<UserOutlined />}
              className="font-semibold rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#FFCF71",
                color: "#333",
                border: "none",
                padding: "0.6rem 1.2rem",
              }}
            >
              {username}
            </Button>
          ) : (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0, -4, 0] }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: 1,
                delay: 0.3,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  icon={<UserOutlined />}
                  className="font-semibold rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#008BE0",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#006BB3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#008BE0";
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
