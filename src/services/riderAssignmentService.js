// src/services/riderAssignmentService.js
import API from "../utils/api";
import { notify } from "../components/common/Notification";
import { getSocket } from "./socket";

let activeAudio = null;
const ORDER_ACCEPT_TIMEOUT = 10; // seconds

// 🔊 Play notification sound for new orders
export function playOrderAlertSound() {
  try {
    if (!activeAudio) {
      activeAudio = new Audio("/assets/sounds/new_order_alert.mp3");
      activeAudio.loop = true;
      activeAudio.volume = 0.8;
    }
    activeAudio.currentTime = 0;
    activeAudio.play().catch(() => {
      // autoplay may be blocked until user interacts
    });
  } catch (err) {
    console.warn("sound play error", err);
  }
}

// 🛑 Stop the notification sound
export function stopOrderAlertSound() {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
  } catch (err) {
    console.warn("sound stop error", err);
  }
}

// ✅ Accept order
export async function acceptOrder(orderId) {
  try {
    const riderId = localStorage.getItem("riderId");
    const res = await API.post(`/orders/${orderId}/accept`, { riderId });
    stopOrderAlertSound();
    notify.success("Order Accepted", "You accepted the order.");
    const socket = getSocket();
    if (socket) socket.emit("order:accepted", { orderId, riderId });
    return res.data;
  } catch (err) {
    notify.error("Accept Failed", err.message || "Unable to accept order.");
    throw err;
  }
}

// ❌ Reject order
export async function rejectOrder(orderId) {
  try {
    const riderId = localStorage.getItem("riderId");
    const res = await API.post(`/orders/${orderId}/reject`, { riderId });
    stopOrderAlertSound();
    notify.info("Order Rejected", "You rejected the order.");
    const socket = getSocket();
    if (socket) socket.emit("order:rejected", { orderId, riderId });
    return res.data;
  } catch (err) {
    notify.error("Reject Failed", err.message || "Unable to reject order.");
    throw err;
  }
}

// 🔁 Assign order to nearest rider
export async function assignOrderToNearestRider(orderId, location) {
  try {
    const res = await API.post(`/orders/assign-rider`, { orderId, location });
    return res.data; // returns assigned rider info
  } catch (err) {
    console.error("Assign order failed", err);
    throw err;
  }
}

// ⏱ Start countdown for new order assignment
export function startOrderCountdown(order, onExpire) {
  playOrderAlertSound();
  let timeLeft = ORDER_ACCEPT_TIMEOUT;

  const interval = setInterval(async () => {
    timeLeft -= 1;

    if (timeLeft <= 0) {
      clearInterval(interval);
      stopOrderAlertSound();
      notify.info("Order Reassigned", "You did not accept the order in time.");
      if (typeof onExpire === "function") onExpire(order);
    }
  }, 1000);

  return interval; // caller can clearInterval if needed
}

// 💰 Confirm pay-on-delivery payment
export async function confirmPayOnDelivery(orderId) {
  try {
    const riderId = localStorage.getItem("riderId");
    const res = await API.patch(`/orders/${orderId}/confirm-payment`, { riderId });
    notify.success("Payment Confirmed", "Pay-on-delivery has been confirmed.");
    return res.data;
  } catch (err) {
    notify.error("Payment Confirmation Failed", err.message || "Unable to confirm payment.");
    throw err;
  }
}
