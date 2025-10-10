// src/services/notificationListener.js
import { io } from "socket.io-client";
import { notify } from "../components/common/Notification";
import { playNotificationSound } from "./soundService";

let socket;

export function initNotificationSocket(userId, role) {
  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
  socket.emit("join_room", `${role}_${userId}`);

  socket.on("order_notification", (data) => {
    const { type, order } = data;
    handleOrderNotification(type, order);
  });
}

function handleOrderNotification(type, order) {
  switch (type) {
    case "new_order":
      notify.info("New Order Received!", `Order #${order.id}`);
      playNotificationSound();
      break;

    case "order_processing":
      notify.success("Order Processing", "Vendor has accepted your order!");
      break;

    case "order_ready":
      notify.info("Order Ready!", "Your order is ready for pickup!");
      playNotificationSound();
      break;

    case "rider_picking_up":
      notify.info("Rider Picking Up", "Rider is on the way to collect your order.");
      break;

    case "rider_delivering":
      notify.info("Rider Delivering", "Track your rider now.");
      break;

    case "rider_arrived":
      notify.info("Rider Arrived!", "Rider is at your location.");
      playNotificationSound();
      break;

    case "order_delivered":
      notify.success("Delivered!", "Your order has been delivered. Thank you!");
      break;

    default:
      notify.info("Update", "New order activity.");
  }
}
