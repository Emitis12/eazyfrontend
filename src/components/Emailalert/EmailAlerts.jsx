import React from "react";

export default function PremiumEmailAlert() {
  return (
    <div className="relative w-full flex justify-center">
      {/* Overlapping floating card centered between sections */}
      <div
        className="absolute top-1/2 -translate-y-1/2 z-20 
        w-[88%] sm:w-4/5 md:w-2/3 lg:w-[50%]
        bg-[#FFCF71] rounded-lg 
        px-3 sm:px-6 py-3 sm:py-5 
        flex flex-col md:flex-row items-center justify-between gap-2
        transition-all duration-300"
      >
        {/* Left text content */}
        <div className="text-center md:text-left space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            Get Premium Eazy Alerts 🚀
          </h2>
          <p className="text-gray-800 text-[11px] sm:text-xs leading-snug">
            Be the first to know about new vendors, exclusive offers, and fresh deals!
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-row items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end"
        >
          <input
            type="email"
            placeholder="Email address"
            required
            className="w-[60%] sm:w-64 px-2.5 py-1.5 rounded-full border-2 border-black 
            focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-600 
            text-gray-800 text-[11px] sm:text-sm bg-transparent"
          />
          <button
            type="submit"
            className="border-2 border-black bg-gray-900 text-white font-semibold 
            px-3 py-1.5 rounded-full hover:bg-gray-800 transition-all duration-200 
            text-[11px] sm:text-sm"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
