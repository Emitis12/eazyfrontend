import React from "react";
import { useCart } from "../../context/CartContext";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, totalPrice } = useCart();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar links={[]} role="User" />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart 🛍️</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="w-full bg-white rounded-lg shadow mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">₦{item.price.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Total: ₦{totalPrice.toLocaleString()}</h3>
              <Link
                to="/user/checkout"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
