import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUtensils,
  FaCapsules,
  FaAppleAlt,
  FaMobileAlt,
  FaMotorcycle,
  FaSearch,
  FaTachometerAlt,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../../utils/api"; // ✅ Make sure this is configured properly

// 🧭 Sidebar Categories
const categories = [
  { name: "Dashboard", icon: FaTachometerAlt, path: "/user/dashboard" },
  { name: "Food", icon: FaUtensils },
  { name: "Pharmaceutical", icon: FaCapsules },
  { name: "Groceries", icon: FaAppleAlt },
  { name: "Gadgets", icon: FaMobileAlt },
  { name: "Send a Rider", icon: FaMotorcycle },
];

export default function Marketplace() {
  const { addToCart } = useCart();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch vendors from backend
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/vendors`);
        setVendors(data?.vendors || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // 🔍 Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory =
      selectedCategory === "All" || vendor.category === selectedCategory;
    const matchesSearch = vendor.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar === */}
      <aside
        className={`bg-white shadow-md border-r transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold text-blue-600">Eazy Market</h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-700"
          >
            <FaBars />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-3 flex-1">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
              selectedCategory === "All"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span className="text-lg">🏪</span>
            {isSidebarOpen && <span>All Vendors</span>}
          </button>

          {categories.map((cat) =>
            cat.path ? (
              <Link
                key={cat.name}
                to={cat.path}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition hover:bg-gray-100 text-gray-700"
              >
                <cat.icon />
                {isSidebarOpen && <span>{cat.name}</span>}
              </Link>
            ) : (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
                  selectedCategory === cat.name
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <cat.icon />
                {isSidebarOpen && <span>{cat.name}</span>}
              </button>
            )
          )}
        </nav>

        {/* Footer: Back to Dashboard */}
        <div className="p-4 border-t">
          <Link
            to="/user/dashboard"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-semibold"
          >
            <FaTachometerAlt />
            {isSidebarOpen && <span>Back to Dashboard</span>}
          </Link>
        </div>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Premium Marketplace 🛍️</h2>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendor or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <select
              className="border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-400"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All</option>
              {categories
                .filter((c) => !c.path)
                .map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <p className="text-gray-500 text-center py-20">Loading vendors...</p>
        ) : filteredVendors.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No vendors found 🕵️‍♂️</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
              >
                <img
                  src={vendor.image || "/assets/images/globe.png"}
                  alt={vendor.name}
                  className="w-24 h-24 object-contain mb-3"
                />
                <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.category}</p>
                <p className="text-blue-600 font-bold mt-2">
                  ₦{vendor?.price?.toLocaleString?.() || "N/A"}
                </p>
                <button
                  onClick={() => addToCart(vendor)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
