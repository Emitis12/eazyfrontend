// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/Sidebar/AdminSidebar";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { Line, Bar, Pie } from "react-chartjs-2";
import useFetch from "../../hooks/useFetch";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // Fetching mock data using hooks
  const { data: stats, loading } = useFetch("/api/admin/dashboardStats"); // users, orders, revenue
  const { data: recentOrders } = useFetch("/api/admin/recentOrders");
  const { data: recentUsers } = useFetch("/api/admin/recentUsers");

  // Sample chart data
  const revenueChart = {
    labels: stats?.revenue?.map(r => r.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: stats?.revenue?.map(r => r.amount) || [],
        borderColor: "#008BE0",
        backgroundColor: "rgba(0,139,224,0.2)",
        tension: 0.3,
      },
    ],
  };

  const ordersChart = {
    labels: stats?.orders?.map(o => o.date) || [],
    datasets: [
      {
        label: "Orders",
        data: stats?.orders?.map(o => o.count) || [],
        backgroundColor: "#FFCF71",
      },
    ],
  };

  const usersChart = {
    labels: ["Admin", "Vendors", "Riders", "Users"],
    datasets: [
      {
        label: "User Distribution",
        data: [
          stats?.admins || 0,
          stats?.vendors || 0,
          stats?.riders || 0,
          stats?.users || 0,
        ],
        backgroundColor: ["#008BE0", "#FFCF71", "#00C49F", "#FF8042"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Users" value={stats?.users || 0} icon="👤" loading={loading} />
          <Card title="Total Orders" value={stats?.ordersTotal || 0} icon="📦" loading={loading} />
          <Card title="Total Revenue" value={`$${stats?.revenueTotal || 0}`} icon="💰" loading={loading} />
          <Card title="Active Vendors" value={stats?.vendors || 0} icon="🏪" loading={loading} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Revenue Over Time</h3>
            <Line data={revenueChart} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Orders Trend</h3>
            <Bar data={ordersChart} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">User Distribution</h3>
            <Pie data={usersChart} />
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Orders</h3>
          <Table
            columns={[
              { title: "Order ID", field: "id" },
              { title: "User", field: "user" },
              { title: "Amount", field: "amount" },
              { title: "Status", field: "status" },
              { title: "Date", field: "date" },
            ]}
            data={recentOrders || []}
            search
            filter
          />
        </div>
      </main>
    </div>
  );
}
