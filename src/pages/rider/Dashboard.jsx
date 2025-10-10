// src/pages/rider/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import RiderSidebar from "../../components/layout/sidebar/RiderSidebar";
import { Outlet } from "react-router-dom";
import { Card } from "../../components/common/Card";
import Button from "../../components/common/Button";
import { notify } from "../../components/common/Notification";
import { io } from "socket.io-client";
import API from "../../utils/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const analyticsData = [
  { day: "Mon", deliveries: 5 },
  { day: "Tue", deliveries: 8 },
  { day: "Wed", deliveries: 6 },
  { day: "Thu", deliveries: 10 },
  { day: "Fri", deliveries: 7 },
  { day: "Sat", deliveries: 9 },
  { day: "Sun", deliveries: 4 },
];

export default function Dashboard({ riderId, isLoggedIn }) {
  const [balance, setBalance] = useState(320);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const socketRef = useRef(null);
  const countdownRef = useRef(null);
  const notificationSound = useRef(new Audio("/sounds/notification.mp3"));

  // --- Socket Setup ---
  useEffect(() => {
    if (!isLoggedIn || !riderId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.emit("join_rider_room", riderId);

    socket.on("new_order", (order) => {
      setIncomingOrder(order);
      setTimeLeft(10);
      setNewOrdersCount((prev) => prev + 1);

      // Play notification sound
      notificationSound.current.loop = true;
      notificationSound.current.play().catch(() => {});

      // Toast notification
      notify.info("New Order!", `Order #${order._id} assigned to you.`);

      // Desktop notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("New Order!", {
            body: `Order #${order._id} assigned to you.`,
            icon: "/assets/rider.png",
          });
        } else {
          Notification.requestPermission();
        }
      }
    });

    return () => {
      socket.disconnect();
      clearInterval(countdownRef.current);
      notificationSound.current.pause();
    };
  }, [riderId, isLoggedIn]);

  // --- Countdown for incoming order ---
  useEffect(() => {
    if (!incomingOrder) return;

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleOrderExpire(incomingOrder._id);
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [incomingOrder]);

  // --- Handle order expiration ---
  const handleOrderExpire = async (orderId) => {
    notificationSound.current.pause();
    notificationSound.current.currentTime = 0;
    notify.warning("Order Expired", "Reassigning order to another nearby rider...");
    setIncomingOrder(null);
    try {
      await API.post(`/orders/reassign/${orderId}`, { riderId });
    } catch (error) {
      console.error("Reassign error:", error);
    }
  };

  // --- Accept / Reject order ---
  const handleAcceptOrder = async () => {
    try {
      await API.post(`/orders/${incomingOrder._id}/accept`, { riderId });
      notify.success("Order Accepted", "Proceed to pickup location 🚴‍♂️");
      notificationSound.current.pause();
      setIncomingOrder(null);
      clearInterval(countdownRef.current);
    } catch (error) {
      notify.error("Error", "Failed to accept the order.");
    }
  };

  const handleRejectOrder = async () => {
    try {
      await API.post(`/orders/${incomingOrder._id}/reject`, { riderId });
      notify.info("Order Rejected", "Finding another nearby rider...");
      notificationSound.current.pause();
      setIncomingOrder(null);
      clearInterval(countdownRef.current);
    } catch (error) {
      notify.error("Error", "Failed to reject the order.");
    }
  };

  // --- Withdraw ---
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return notify.error("Enter a valid amount");
    if (amount > balance) return notify.error("Insufficient balance");

    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      { id: prev.length + 1, type: "Debit", amount, date: new Date().toLocaleDateString() },
      ...prev,
    ]);
    setWithdrawAmount("");
    notify.success("Withdrawal submitted!", `₦${amount.toLocaleString()} requested.`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RiderSidebar newOrdersCount={newOrdersCount} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Rider Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Active Deliveries" value="12" />
          <Card title="Completed Deliveries" value="48" />
          <Card title="Wallet Balance" value={`₦${balance.toLocaleString()}`} />
        </div>

        {/* Weekly Delivery Chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Deliveries This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="deliveries" stroke="#008BE0" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wallet Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Wallet</h3>
          <p className="text-gray-700 mb-4">
            Current Balance:{" "}
            <span className="font-bold text-lg">₦{balance.toLocaleString()}</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none w-full sm:w-1/3"
            />
            <Button label="Withdraw" onClick={handleWithdraw} variant="primary" />
          </div>
        </div>

        <Outlet />

        {/* Incoming Order Modal */}
        {incomingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 relative animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
                🚨 New Order Alert!
              </h2>

              <div className="space-y-2 sm:space-y-3 text-gray-700">
                <p><span className="font-semibold">Order ID:</span> {incomingOrder._id}</p>
                <p><span className="font-semibold">Pickup:</span> {incomingOrder.pickupAddress}</p>
                <p><span className="font-semibold">Drop-off:</span> {incomingOrder.deliveryAddress}</p>
              </div>

              <div className="text-center text-sm sm:text-base text-gray-500 mt-3 mb-4 sm:mb-6">
                Auto-reassigning in <span className="font-bold">{timeLeft}s</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button className="w-full sm:w-auto" label="Accept" onClick={handleAcceptOrder} variant="success" />
                <Button className="w-full sm:w-auto" label="Reject" onClick={handleRejectOrder} variant="danger" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
