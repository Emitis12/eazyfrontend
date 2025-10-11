import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function LiveRiderTracker() {
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3001"); // backend socket

    socket.on("rider_location_update", (data) => {
      setRiders((prev) => {
        const others = prev.filter((r) => r.riderId !== data.riderId);
        return [...others, data];
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <MapContainer center={[6.5244, 3.3792]} zoom={12} className="h-[500px] w-full rounded-lg shadow">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {riders.map((rider) => (
        <Marker key={rider.riderId} position={[rider.lat, rider.lng]}>
          <Popup>{`Rider ${rider.riderId}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
