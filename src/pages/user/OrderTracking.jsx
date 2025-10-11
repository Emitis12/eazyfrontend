// src/pages/user/OrderTracking.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import API from "../../utils/api";
import Button from "../../components/common/Button";
import ChatModal from "../../components/common/ChatModal";
import "leaflet/dist/leaflet.css";

// === Custom Icons ===
const riderIcon = new L.Icon({
  iconUrl: "/assets/rider-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const homeIcon = new L.Icon({
  iconUrl: "/assets/home-marker.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// === Helper component to recenter map on rider movement ===
function MapAutoCenter({ riderLocation }) {
  const map = useMap();
  useEffect(() => {
    if (riderLocation)
      map.flyTo([riderLocation.lat, riderLocation.lng], map.getZoom(), { duration: 0.8 });
  }, [riderLocation, map]);
  return null;
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [eta, setEta] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const socketRef = useRef(null);

  const customerLocation =
    order?.address?.lat && order?.address?.lng
      ? [order.address.lat, order.address.lng]
      : [6.5244, 3.3792]; // Default Lagos

  // === Fetch order details ===
  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${orderId}`);
      setOrder(res.data);

      if (res.data?.rider?.lat && res.data?.rider?.lng) {
        setRiderLocation({ lat: res.data.rider.lat, lng: res.data.rider.lng });
      }
    } catch (err) {
      console.error("Fetch order failed:", err);
    }
  };

  // === Fetch ETA using Google Maps Directions API ===
  const fetchETA = async (riderLat, riderLng, destLat, destLng) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!API_KEY) return;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${riderLat},${riderLng}&destination=${destLat},${destLng}&key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        const duration = data.routes[0].legs[0].duration.text;
        setEta(duration);
      }
    } catch (err) {
      console.error("Failed to fetch ETA:", err);
    }
  };

  // === Socket & Notifications ===
  useEffect(() => {
    fetchOrder();

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
    socketRef.current = socket;

    socket.emit("join_order_room", orderId);

    socket.on("rider:location-update", (location) => {
      setRiderLocation(location);

      // Throttle notifications
      const now = Date.now();
      if (Notification.permission === "granted" && now - lastUpdate > 8000) {
        new Notification("Rider Update 🚴‍♂️", {
          body: "Your rider’s location has changed.",
          icon: "/assets/rider-marker.png",
        });
        setLastUpdate(now);
      }
    });

    socket.on("order:update", (update) => {
      if (Notification.permission === "granted") {
        new Notification("Order Update 🧾", {
          body: update.message || "Your order status changed.",
          icon: "/assets/order-icon.png",
        });
      }
    });

    return () => socket.disconnect();
  }, [orderId, lastUpdate]);

  // === ETA calculation whenever rider moves ===
  useEffect(() => {
    if (riderLocation && order?.address?.lat && order?.address?.lng) {
      fetchETA(riderLocation.lat, riderLocation.lng, order.address.lat, order.address.lng);

      const interval = setInterval(() => {
        fetchETA(riderLocation.lat, riderLocation.lng, order.address.lat, order.address.lng);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [riderLocation, order]);

  if (!order)
    return <p className="text-center mt-10 text-gray-600">Loading order details...</p>;

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center sm:text-left">
        Track Your Order #{order._id}
      </h2>

      {/* === Order Info === */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-2 text-sm sm:text-base">
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        {order.rider && (
          <p>
            <strong>Rider:</strong> {order.rider.name} |{" "}
            <strong>Phone:</strong> {order.rider.phone}
          </p>
        )}
        {eta && (
          <p>
            <strong>ETA:</strong> {eta}
          </p>
        )}
      </div>

      {/* === Map Section === */}
      <div
        id="map-container"
        className="h-[400px] sm:h-[500px] w-full rounded-xl overflow-hidden shadow-md"
      >
        <MapContainer
          center={riderLocation || customerLocation}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapAutoCenter riderLocation={riderLocation} />

          {/* Rider Marker */}
          {riderLocation && (
            <Marker position={riderLocation} icon={riderIcon}>
              <Popup>Rider’s Current Location 🚴‍♂️</Popup>
            </Marker>
          )}

          {/* Customer Marker */}
          {order.address?.lat && (
            <Marker position={customerLocation} icon={homeIcon}>
              <Popup>Delivery Address 🏠</Popup>
            </Marker>
          )}

          {/* Route line */}
          {riderLocation && order.address?.lat && (
            <Polyline
              positions={[
                [riderLocation.lat, riderLocation.lng],
                [order.address.lat, order.address.lng],
              ]}
              color="blue"
              weight={4}
              opacity={0.6}
            />
          )}
        </MapContainer>
      </div>

      {/* === Action Buttons === */}
      {order.rider && (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            label="Call Rider"
            onClick={() => window.open(`tel:${order.rider.phone}`)}
            variant="primary"
            className="w-full sm:w-auto"
          />
          <Button
            label="Track Rider"
            onClick={() =>
              document
                .getElementById("map-container")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            variant="outline"
            className="w-full sm:w-auto"
          />
          <Button
            label="Chat with Rider"
            onClick={() => setChatOpen(true)}
            variant="secondary"
            className="w-full sm:w-auto"
          />
        </div>
      )}

      {/* === Chat Modal === */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        roomId={`order_${order._id}`}
        userName="Customer"
      />
    </div>
  );
}
