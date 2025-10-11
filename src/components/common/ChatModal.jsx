// src/components/common/ChatModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Button from "./Button";

export default function ChatModal({ isOpen, onClose, roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !roomId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.emit("join_chat_room", roomId);

    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      setMessages([]);
    };
  }, [isOpen, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgObj = { user: userName || "You", text: input, time: new Date().toLocaleTimeString() };
    socketRef.current.emit("chat_message", { roomId, ...msgObj });
    setMessages((prev) => [...prev, msgObj]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col h-[70vh] sm:h-[60vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Live Chat</h3>
          <Button label="Close" onClick={onClose} variant="outline" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[80%] ${
                m.user === "You" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
              }`}
            >
              <p className="text-sm font-semibold">{m.user}</p>
              <p className="text-sm">{m.text}</p>
              <span className="text-xs text-gray-500">{m.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex p-4 border-t gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button label="Send" onClick={sendMessage} variant="primary" />
        </div>
      </div>
    </div>
  );
}
