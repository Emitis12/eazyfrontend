import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full"
      >
        <div className="flex justify-center mb-5">
          <AlertTriangle size={70} className="text-yellow-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-500 mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={resetErrorBoundary}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Go Home
          </Link>
        </div>
      </motion.div>

      <p className="text-gray-400 text-sm mt-6">
        © {new Date().getFullYear()} Eazy Platform. All rights reserved.
      </p>
    </div>
  );
}
