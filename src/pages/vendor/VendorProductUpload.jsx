import React, { useState } from "react";
import API from "../../utils/api";
import { notify } from "../../components/common/Notification";
import { motion } from "framer-motion";

const VendorProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== Real-time location suggestion (mocked for now) =====
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    const suggestions = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu"].filter((loc) =>
      loc.toLowerCase().includes(value.toLowerCase())
    );
    setLocationSuggestions(suggestions);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // ===== Submit Product =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || productImages.length === 0 || !productDescription || !location) {
      notify("All fields are required!", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", productName);
    productImages.forEach((img) => formData.append("images", img));
    formData.append("description", productDescription);
    formData.append("location", location);

    try {
      const res = await API.post("/vendor/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notify(
        "Product submitted successfully! It is under review and will go live within 30 minutes to 1 hour.",
        "info"
      );

      // Reset form (keep it open for more uploads)
      setProductName("");
      setProductImages([]);
      setImagePreviews([]);
      setProductDescription("");
      setLocation("");
      setLocationSuggestions([]);
    } catch (error) {
      console.error(error);
      notify("Failed to submit product.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start py-10 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-6 rounded-2xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload a Product</h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Enter product name"
          />
        </div>

        {/* Product Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-md"
          />
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Describe your product"
            rows={4}
          />
        </div>

        {/* Location with live suggestions */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Enter your location"
          />
          {locationSuggestions.length > 0 && (
            <ul className="absolute bg-white border rounded-md mt-1 w-full z-10">
              {locationSuggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="p-2 cursor-pointer hover:bg-green-50"
                  onClick={() => {
                    setLocation(suggestion);
                    setLocationSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } transition-all`}
        >
          {loading ? "Submitting..." : "Submit Product"}
        </button>
      </motion.form>
    </div>
  );
};

export default VendorProductUpload;
