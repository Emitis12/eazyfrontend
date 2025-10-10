import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <div className="flex justify-center mb-4">
          <ShieldAlert size={60} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.  
          Please log in with the correct account or contact an administrator.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
          >
            Go to Login
          </Link>

          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Back Home
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-400 text-sm mt-6">
        © {new Date().getFullYear()} Eazy Platform. All rights reserved.
      </p>
    </div>
  );
}
