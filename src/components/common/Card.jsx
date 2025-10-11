import React from "react";
import { motion } from "framer-motion";

export default function Card({
  children,
  onClick,
  className = "",
  hover = true,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`bg-white rounded-2xl shadow-md p-5 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
