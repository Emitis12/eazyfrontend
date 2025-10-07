import { useState, useEffect } from "react";
import { Button } from "antd";
import { motion } from "framer-motion";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logowhite from "../../assets/logowhite.png"; // ✅ fixed image import path

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={logowhite}
            alt="Eazy"
            className="w-25 h-11"
            whileHover={{ rotate: 10 }}
          />
        </Link>

        {/* Animated Login Button */}
        <div className="flex flex-col items-end md:items-center">
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
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#006BB3";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#008BE0";
                  e.currentTarget.style.color = "#FFCF71";
                }}
              >
                Login
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
