// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:3002";
let socket = null;

export function initSocket(token) {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });
  return socket;
}

export function getSocket() {
  return socket;
}
