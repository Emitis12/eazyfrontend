import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { getAdminToken } from "../../utils/api"; // or your auth util
import axios from "axios";

export default function DeliveryTasks() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

  // Fetch deliveries assigned to this rider
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = getAdminToken();
        const { data } = await axios.get(`${API_URL}/rider/deliveries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(data.deliveries || []);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Update delivery status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = getAdminToken();
      await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDeliveries((prev) =>
        prev.map((d) => (d._id === orderId ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      console.error("Failed to update delivery status:", error);
    }
  };

  // Confirm Pay-on-Delivery
  const handleConfirmPayment = async (orderId) => {
    try {
      const token = getAdminToken();
      await axios.post(
        `${API_URL}/orders/${orderId}/confirm-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Payment confirmed successfully!");
      handleStatusUpdate(orderId, "Completed");
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  if (loading) return <p>Loading deliveries...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-6">My Delivery Tasks 🚴‍♂️</h2>

      {deliveries.length === 0 ? (
        <p className="text-gray-500">No active deliveries assigned.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Customer</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{d.customerName}</td>
                  <td className="p-3">{d.deliveryAddress}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        d.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : d.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : d.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {d.status === "Pending" && (
                      <Button
                        onClick={() => handleStatusUpdate(d._id, "In Progress")}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Start
                      </Button>
                    )}
                    {d.status === "In Progress" && (
                      <Button
                        onClick={() => handleStatusUpdate(d._id, "Delivered")}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {d.paymentMethod === "Pay on Delivery" &&
                      d.status === "Delivered" && (
                        <Button
                          onClick={() => handleConfirmPayment(d._id)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                        >
                          Confirm Payment
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
