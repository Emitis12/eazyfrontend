import React from "react";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Checkout 💳</h2>
        <p className="mb-2">Items: {cart.length}</p>
        <p className="mb-4 font-semibold">Total: ₦{totalPrice.toLocaleString()}</p>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
