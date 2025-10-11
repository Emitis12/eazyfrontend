// src/pages/rider/PaymentConfirm.jsx
import React, { useState, useEffect } from "react";
import { confirmPayOnDelivery } from "../../services/riderAssignmentService";
import { useParams } from "react-router-dom";
import { notify } from "../../components/common/Notification";

export default function PaymentConfirm() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await confirmPayOnDelivery(orderId);
      notify.success("Success", "Order payment confirmed successfully.");
    } catch (error) {
      notify.error("Error", "Failed to confirm payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">Confirm Payment 💵</h2>
        <p className="text-gray-600 mb-6">
          Tap the button below once you’ve received cash for this delivery.
        </p>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 transition"
          }`}
        >
          {loading ? "Confirming..." : "Confirm Payment Received"}
        </button>
      </div>
    </div>
  );
}
