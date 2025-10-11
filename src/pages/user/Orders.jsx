import React, { useState } from "react";
import Card from "../../components/common/Card";
import LiveRiderTracker from "../../components/Map/LiveRiderTracker";

const sampleOrders = [
  { id: 1, product: "Groceries", status: "In Progress", riderId: "RIDER123" },
  { id: 2, product: "Electronics", status: "Delivered", riderId: "RIDER456" },
];

export default function Orders() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {sampleOrders.map((order) => (
          <Card
            key={order.id}
            title={`Order #${order.id}`}
            value={`Product: ${order.product}`}
            subtitle={`Status: ${order.status}`}
          />
        ))}
      </div>

      {/* Live Rider Tracker for active orders */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Track Active Riders</h3>
        <LiveRiderTracker />
      </div>
    </div>
  );
}
