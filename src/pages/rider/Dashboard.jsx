// src/pages/rider/Dashboard.jsx
import React, { useState, useEffect } from "react";
import RiderSidebar from "../../components/layout/Sidebar/RiderSidebar";
import { Outlet } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../../components/common/Button";
import { notify } from "../../components/common/Notification";
import { io } from "socket.io-client";

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

  // Notification sound
  const notificationSound = new Audio("/sounds/notification.mp3"); // Add your sound file

  // Real-time notifications
  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = io("http://localhost:3001"); // Backend URL
    socket.emit("join_rider_room", riderId);

    socket.on("new_order", (order) => {
      notify.info("New Order Assigned!", `Order #${order.id} assigned to you.`);
      notificationSound.play().catch(() => {}); // play sound
      setNewOrdersCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, [riderId, isLoggedIn]);

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
    notify.success("Withdrawal request submitted!", `You requested $${amount}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RiderSidebar newOrdersCount={newOrdersCount} />

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Rider Dashboard</h2>

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Active Deliveries" value="12" />
          <Card title="Completed Deliveries" value="48" />
          <Card title="Weekly Earnings" value={`$${balance}`} />
        </div>

        {/* Delivery chart */}
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
            Current Balance: <span className="font-bold text-lg">${balance}</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <input
              type="number"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none w-full sm:w-1/3"
            />
            <Button label="Withdraw" onClick={handleWithdraw} variant="primary" />
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
