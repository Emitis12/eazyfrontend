// src/services/notificationService.js
import API from "../utils/api";
import { notify } from "../components/common/Notification";

let previousNotificationIds = new Set(); // Track already played notifications
let audio = null;

/**
 * Initialize the notification sound (only once)
 */
function initNotificationSound() {
  if (!audio) {
    audio = new Audio("/assets/sounds/notification.mp3"); // ✅ place mp3 in public/assets/sounds/
    audio.volume = 0.7;
  }
}

/**
 * Play notification sound for new notifications.
 */
function playNotificationSound() {
  try {
    initNotificationSound();
    audio.currentTime = 0;
    audio.play();
  } catch (err) {
    console.warn("Notification sound could not play automatically:", err);
  }
}

/**
 * Send a real-time or email notification.
 */
export async function sendNotification({ to, title, message, type = "info" }) {
  try {
    const res = await API.post("/notifications", { to, title, message, type });
    notify.success("Notification Sent", `Sent to ${to}`);
    return res.data;
  } catch (error) {
    console.error("Notification error:", error);
    notify.error("Notification Error", "Unable to send notification.");
    throw error;
  }
}

/**
 * Fetch user notifications and play sound for new ones.
 */
export async function getUserNotifications(userId, playSound = true) {
  try {
    const res = await API.get(`/notifications/user/${userId}`);
    const notifications = res.data || [];

    if (playSound && notifications.length > 0) {
      // Find new notifications
      const newOnes = notifications.filter(
        (n) => !previousNotificationIds.has(n._id)
      );

      if (newOnes.length > 0) {
        playNotificationSound();
        newOnes.forEach((n) => notify.info(n.title, n.message));
      }

      // Update cache
      previousNotificationIds = new Set(notifications.map((n) => n._id));
    }

    return notifications;
  } catch (error) {
    console.error("Fetch notification error:", error);
    return [];
  }
}

/**
 * Subscribe rider to periodic in-app notification checks
 * (polls every 15 seconds — can be replaced by WebSocket later)
 */
export function startRiderNotificationWatcher(riderId, intervalMs = 15000) {
  initNotificationSound();

  const checkNotifications = async () => {
    await getUserNotifications(riderId, true);
  };

  checkNotifications(); // Run immediately
  const interval = setInterval(checkNotifications, intervalMs);

  return () => clearInterval(interval); // Cleanup function
}
