// src/pages/user/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../utils/api";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // Save order to backend
  const saveOrder = async (paymentMethod) => {
    const userId = localStorage.getItem("userId");
    const { data } = await API.post("/orders/create", {
      items: cart,
      totalPrice,
      address,
      paymentMethod,
      userId,
    });
    return data;
  };

  // Paystack integration
  const handlePayNow = async () => {
    try {
      setLoading(true);
      const order = await saveOrder("pay-now");

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxx",
        email: "customer@example.com", // replace with logged-in user’s email
        amount: totalPrice * 100,
        currency: "NGN",
        callback: async function (response) {
          await API.post("/orders/paystack/verify", {
            reference: response.reference,
            orderId: order._id,
          });
          alert("✅ Payment verified and order processing!");
          clearCart();
        },
        onClose: function () {
          alert("Payment window closed.");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pay on delivery
  const handlePayOnDelivery = async () => {
    try {
      setLoading(true);
      const order = await saveOrder("pay-on-delivery");

      if (order.riderAssigned) {
        alert(`🚴 Order placed! Rider ${order.rider.name} is on the way.`);
      } else {
        alert("✅ Order placed! Waiting for a nearby rider...");
      }
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Choose location from map (placeholder)
  const handleChooseLocation = () => {
    alert("🗺️ Feature coming soon: Choose location from map!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout 💳</h2>

        {/* Order Summary */}
        <div className="mb-4 text-gray-700">
          <p>
            Items: <span className="font-semibold">{cart.length}</span>
          </p>
          <p>
            Total:{" "}
            <span className="font-bold text-blue-700">
              ₦{totalPrice.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Delivery Form */}
        <form className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Delivery Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
          <textarea
            placeholder="Additional Notes (optional)"
            value={address.notes}
            onChange={(e) => setAddress({ ...address, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            rows="2"
          />
        </form>

        {/* Choose Current Location */}
        <button
          onClick={handleChooseLocation}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg mb-4 hover:bg-yellow-600 transition"
        >
          Use Current Location 📍
        </button>

        {/* Payment Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayNow}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg transition`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <button
            onClick={handlePayOnDelivery}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 rounded-lg transition`}
          >
            {loading ? "Placing Order..." : "Pay on Delivery"}
          </button>
        </div>
      </div>
    </div>
  );
}
