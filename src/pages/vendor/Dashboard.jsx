// src/pages/vendor/Dashboard.jsx
import React, { useState } from "react";
import VendorSidebar from "../../components/layout/sidebar/VendorSidebar";
import { Outlet } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const earningsData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 2200 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2500 },
];

export default function Dashboard() {
  const [walletBalance, setWalletBalance] = useState(1200);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!isNaN(amount) && amount <= walletBalance) {
      setWalletBalance((prev) => prev - amount);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      alert(`Withdrawal request of $${amount} submitted!`);
    } else {
      alert("Invalid withdrawal amount.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <VendorSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Vendor Dashboard</h2>

        {/* Premium analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card title="Total Orders" value="120" />
          <Card title="Revenue" value="$5,400" />
          <Card title="Active Offers" value="8" />
          <Card
            title="Wallet Balance"
            value={`$${walletBalance.toFixed(2)}`}
            action={
              <Button
                label="Withdraw"
                variant="outline"
                onClick={() => setShowWithdrawModal(true)}
              />
            }
          />
        </div>

        {/* Earnings chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Earnings Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#008BE0" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nested pages */}
        <Outlet />

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <Modal onClose={() => setShowWithdrawModal(false)} title="Request Withdrawal">
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none"
              />
              <Button label="Submit" onClick={handleWithdraw} variant="primary" />
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
