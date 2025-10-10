// src/components/rider/NewOrderModal.jsx
import React, { useEffect, useState } from "react";
import {
  acceptOrder,
  rejectOrder,
  stopOrderAlertSound,
  startOrderCountdown,
  assignOrderToNearestRider,
} from "../../services/riderAssignmentService";

export default function NewOrderModal({ order, onClose }) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // Calculate initial time left from order.expiresAt
    setTimeLeft(Math.max(0, Math.floor((order.expiresAt - Date.now()) / 1000)) || 10);

    // Start countdown using riderAssignmentService
    const countdownInterval = startOrderCountdown(order, async (expiredOrder) => {
      // Auto-reassign to another nearby rider if time runs out
      try {
        await assignOrderToNearestRider(expiredOrder.orderId, expiredOrder.pickupLocation);
        onClose?.();
      } catch (err) {
        console.error("Failed to reassign order:", err);
        onClose?.();
      }
    });

    // Update local countdown for UI display
    const displayInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(displayInterval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(displayInterval);
      stopOrderAlertSound();
    };
  }, [order, onClose]);

  const handleAccept = async () => {
    try {
      await acceptOrder(order.orderId);
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrder(order.orderId);
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">🚴 New Delivery Request</h3>
        <p className="text-gray-600 mb-2">Pickup: {order.pickupAddress}</p>
        <p className="text-gray-600 mb-4">Dropoff: {order.deliveryAddress}</p>

        <div className="mb-4">
          <span className="text-lg font-semibold text-red-600">{timeLeft}s</span>
          <p className="text-xs text-gray-500">to accept or it will be reassigned</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleAccept}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
