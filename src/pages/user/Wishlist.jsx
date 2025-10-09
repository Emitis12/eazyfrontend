import React from "react";
import { Card } from "../../components/common/Card";

const wishlistItems = [
  { id: 1, name: "Groceries Pack", price: "$50" },
  { id: 2, name: "Bluetooth Headset", price: "$30" },
];

export default function Wishlist() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            title={item.name}
            value={item.price}
            subtitle="Click to purchase"
          />
        ))}
      </div>
    </div>
  );
}
