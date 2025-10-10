// src/pages/vendor/VendorDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import VendorSidebar from "../../components/layout/Sidebar/VendorSidebar";
import { Outlet } from "react-router-dom";
import Card from "../../components/common/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ChatModal from "../../components/common/ChatModal";
import API from "../../utils/api";
import { io } from "socket.io-client";
import { notify } from "../../components/common/Notification";

const earningsData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 2200 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2500 },
];

export default function VendorDashboard() {
  const [walletBalance, setWalletBalance] = useState(1200);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const socketRef = useRef(null);
  const pollingRef = useRef(null);

  // --- Fetch Active Orders ---
  const fetchActiveOrders = async () => {
    try {
      const res = await API.get("/orders/vendor/active");
      setActiveOrders(res.data || []);
    } catch (err) {
      console.error("Fetch active orders failed:", err);
    }
  };

  // --- Setup Socket & Polling ---
  useEffect(() => {
    fetchActiveOrders();
    pollingRef.current = setInterval(fetchActiveOrders, 15000);

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.emit("join_vendor_room");

    socket.on("new_order", (order) => {
      setIncomingOrder(order);
      notify.info("New Order Received", `Order #${order._id} has been placed.`);
      fetchActiveOrders();
    });

    return () => {
      clearInterval(pollingRef.current);
      socket.disconnect();
    };
  }, []);

  // --- Withdraw ---
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
      setWalletBalance((prev) => prev - amount);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      notify.success("Withdrawal Submitted", `₦${amount.toLocaleString()} will be processed.`);
    } else {
      notify.error("Invalid Amount", "Enter a valid withdrawal amount.");
    }
  };

  // --- Order Handling ---
  const openOrderModal = (order) => setSelectedOrder(order);
  const closeOrderModal = () => setSelectedOrder(null);

  const handleMarkReady = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/ready`);
      notify.success("Order Ready", "Rider will be assigned automatically.");
      fetchActiveOrders();
      closeOrderModal();
    } catch (err) {
      console.error(err);
      notify.error("Failed", "Unable to mark order as ready.");
    }
  };

  const handleAcceptIncomingOrder = async () => {
    try {
      await API.post(`/orders/${incomingOrder._id}/accept`);
      notify.success("Order Accepted", "You may now begin preparation.");
      setIncomingOrder(null);
      fetchActiveOrders();
    } catch (err) {
      notify.error("Error", "Failed to accept order.");
    }
  };

  const handleRejectIncomingOrder = async () => {
    try {
      await API.post(`/orders/${incomingOrder._id}/reject`);
      notify.info("Order Rejected", "It will be reassigned automatically.");
      setIncomingOrder(null);
      fetchActiveOrders();
    } catch (err) {
      notify.error("Error", "Failed to reject order.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <VendorSidebar
        activeOrderCount={activeOrders.length}
        onActiveOrdersClick={() =>
          activeOrders.length > 0 && setSelectedOrder(activeOrders[0])
        }
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-3 shadow flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Vendor Dashboard</h2>
        <Button
          label="Menu"
          onClick={() =>
            document.querySelector("#vendor-sidebar")?.classList.toggle("hidden")
          }
          variant="outline"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <div className="flex gap-2">
            <Button
              label={`Active Orders (${activeOrders.length})`}
              onClick={() =>
                activeOrders.length > 0 && setSelectedOrder(activeOrders[0])
              }
              variant="primary"
            />
            <Button label="Chat" onClick={() => setChatOpen(true)} variant="secondary" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card title="Total Orders" value="120" />
          <Card title="Revenue" value="₦5,400" />
          <Card title="Active Offers" value="8" />
          <Card
            title="Wallet"
            value={`₦${walletBalance.toLocaleString()}`}
            action={
              <Button
                label="Withdraw"
                variant="outline"
                onClick={() => setShowWithdrawModal(true)}
              />
            }
          />
        </div>

        {/* Chart */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-6">
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

        <Outlet />

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <Modal
            open={showWithdrawModal}
            onCancel={() => setShowWithdrawModal(false)}
            title="Withdraw Funds"
          >
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

        {/* Active Order Modal */}
        {selectedOrder && (
          <Modal
            open={!!selectedOrder}
            onCancel={closeOrderModal}
            title={`Order #${selectedOrder._id}`}
          >
            <div className="space-y-3">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Pickup:</strong> {selectedOrder.pickupAddress}</p>
              <p><strong>Drop-off:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              {selectedOrder.status === "accepted" && (
                <Button
                  label="Mark Order Ready"
                  onClick={() => handleMarkReady(selectedOrder._id)}
                  variant="success"
                />
              )}
            </div>
          </Modal>
        )}

        {/* Incoming Order Modal */}
        {incomingOrder && (
          <Modal
            open={!!incomingOrder}
            onCancel={() => setIncomingOrder(null)}
            title={`New Order #${incomingOrder._id}`}
          >
            <div className="space-y-3">
              <p><strong>Customer:</strong> {incomingOrder.customerName}</p>
              <p><strong>Pickup:</strong> {incomingOrder.pickupAddress}</p>
              <p><strong>Drop-off:</strong> {incomingOrder.deliveryAddress}</p>
              <p><strong>Status:</strong> {incomingOrder.status}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <Button label="Accept" variant="success" onClick={handleAcceptIncomingOrder} />
                <Button label="Reject" variant="danger" onClick={handleRejectIncomingOrder} />
              </div>
            </div>
          </Modal>
        )}

        {/* Chat Modal */}
        {chatOpen && (
          <ChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            roomId="vendor_dashboard_room"
            userName="Vendor"
          />
        )}
      </main>
    </div>
  );
}
