// src/pages/admin/Reports.jsx
import React from "react";
import AdminSidebar from "../../components/layout/sidebar/AdminSidebar";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useFetch } from "../../hooks/useFetch";

export default function Reports() {
  const { data: stats } = useFetch("/api/admin/dashboardStats");

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Revenue Over Time</h3>
            <Line data={revenueChart} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Orders Trend</h3>
            <Bar data={ordersChart} />
          </div>
        </div>
      </main>
    </div>
  );
}
