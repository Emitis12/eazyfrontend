import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full"
      >
        <div className="flex justify-center mb-5">
          <SearchX size={70} className="text-blue-600" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
          >
            Go Home
          </Link>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Login
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-400 text-sm mt-6">
        © {new Date().getFullYear()} Eazy Platform. All rights reserved.
      </p>
    </div>
  );
}
