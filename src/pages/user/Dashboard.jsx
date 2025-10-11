import React from "react";
import UserSidebar from "../../components/layout/Sidebar/UserSidebar";
import { Outlet } from "react-router-dom";
import Card from "../../components/common/Card";
import LiveRiderTracker from "../../components/Map/LiveRiderTracker";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h2>

        {/* Premium Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Active Orders" value="5" />
          <Card title="Completed Orders" value="20" />
          <Card title="Wishlist Items" value="8" />
        </div>

        {/* Live Rider Tracker */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Track Your Rider</h3>
          <LiveRiderTracker />
        </div>

        {/* Nested routes */}
        <Outlet />
      </main>
    </div>
  );
}
