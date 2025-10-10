import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/SideBar";
import LiveRiderTracker from "../../components/Map/LiveRiderTracker";
import Input from "../../components/common/Input";

export default function SendParcel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    pickupAddress: "",
    recipientName: "",
    recipientPhone: "",
    deliveryAddress: "",
    parcelDescription: "",
  });

  const [assignedRider, setAssignedRider] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 🔹 Simulated API call
      const mockRiders = [
        { id: 1, name: "John Doe", distance: "2.3 km away" },
        { id: 2, name: "Mary James", distance: "1.8 km away" },
        { id: 3, name: "Alex Rider", distance: "3.0 km away" },
      ];
      const randomRider =
        mockRiders[Math.floor(Math.random() * mockRiders.length)];

      setTimeout(() => {
        setAssignedRider(randomRider);
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending parcel:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar links={[]} role="User" />

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header Section with Navigation Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Send a Rider 🚴</h2>
            <p className="text-gray-600">
              Book a rider to deliver your parcel in real time.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              ← Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/user/marketplace")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🛒 Order Now
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Sender Info */}
            <Input
              label="Sender Name"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Enter sender's full name"
              required
            />
            <Input
              label="Sender Phone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              placeholder="Enter sender's phone number"
              required
            />
            <Input
              label="Pickup Address"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Where should the rider pick up?"
              required
              className="md:col-span-2"
            />

            {/* Recipient Info */}
            <Input
              label="Recipient Name"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Enter recipient's name"
              required
            />
            <Input
              label="Recipient Phone"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleChange}
              placeholder="Enter recipient's phone number"
              required
            />
            <Input
              label="Delivery Address"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Where should the parcel be delivered?"
              required
              className="md:col-span-2"
            />

            {/* Parcel Description */}
            <Input
              label="Parcel Description"
              name="parcelDescription"
              value={formData.parcelDescription}
              onChange={handleChange}
              placeholder="e.g. small box, envelope, documents, etc."
              textarea
              rows={3}
              className="md:col-span-2"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="col-span-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {submitting ? "Assigning Rider..." : "Send Parcel"}
            </button>
          </form>
        </div>

        {/* Rider Assignment Result */}
        {assignedRider && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-700">
              ✅ Rider Assigned Successfully!
            </h3>
            <p className="text-gray-700">
              Rider: <strong>{assignedRider.name}</strong> ({assignedRider.distance})
            </p>
          </div>
        )}

        {/* Map Tracker */}
        <div className="h-[400px]">
          <LiveRiderTracker />
        </div>
      </main>
    </div>
  );
}
