import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import API, { ApiHelper } from "../../utils/api";
import { notify } from "../common/Notification";

export default function EmailAlerts() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Connect to socket on mount
  useEffect(() => {
    const socketIo = io(`${import.meta.env.VITE_SOCKET_URL}/email-alerts`);
    setSocket(socketIo);

    // Listen for incoming real-time alerts
    socketIo.on("new_alert", (alert) => {
      notify.info(alert.title, alert.message);
    });

    return () => socketIo.disconnect();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await ApiHelper.post("/premium/subscribe", { email });

      // Join socket room for real-time alerts
      socket?.emit("subscribe", email);

      notify.success("Subscribed!", "You will now receive premium Eazy alerts 🚀");
      setEmail("");
    } catch (err) {
      console.error(err);
      notify.error(
        "Subscription Failed",
        err.response?.data?.message || "Unable to subscribe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex justify-center">
      <div
        className="absolute top-1/2 -translate-y-1/2 z-20 
        w-[88%] sm:w-4/5 md:w-2/3 lg:w-[50%]
        bg-[#FFCF71] rounded-lg 
        px-3 sm:px-6 py-3 sm:py-5 
        flex flex-col md:flex-row items-center justify-between gap-2
        transition-all duration-300"
      >
        <div className="text-center md:text-left space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            Get Premium Eazy Alerts 🚀
          </h2>
          <p className="text-gray-800 text-[11px] sm:text-xs leading-snug">
            Be the first to know about new vendors, exclusive offers, and fresh deals!
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-row items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end"
        >
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-[60%] sm:w-64 px-2.5 py-1.5 rounded-full border-2 border-black 
              focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-600 
              text-gray-800 text-[11px] sm:text-sm bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-black bg-gray-900 text-white font-semibold 
              px-3 py-1.5 rounded-full hover:bg-gray-800 transition-all duration-200 
              text-[11px] sm:text-sm"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}
