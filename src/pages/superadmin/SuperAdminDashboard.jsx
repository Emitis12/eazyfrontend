import React from "react";
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import AnalyticsSection from "./components/AnalyticsSection";
import { Card, CardContent } from "../../components/common/Card";
import { FaStore, FaUsers, FaMotorcycle, FaBox } from "react-icons/fa";
import { useSuperAdmin } from "./SuperAdminContext";

export default function SuperAdminDashboard() {
  const { stats, fetchStats } = useSuperAdmin();

  const statsItems = [
    { title: "Vendors", value: stats.vendors.total || 0, icon: <FaStore className="text-[#008BE0]" /> },
    { title: "Riders", value: stats.riders.total || 0, icon: <FaMotorcycle className="text-[#008BE0]" /> },
    { title: "Customers", value: stats.customers.total || 0, icon: <FaUsers className="text-[#008BE0]" /> },
    { title: "Products", value: stats.products.total || 0, icon: <FaBox className="text-[#008BE0]" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Overview & moderation center</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchStats} className="px-3 py-2 rounded bg-white shadow text-sm">Refresh</button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Super Admin</span>
              <img src="https://i.pravatar.cc/40?img=11" alt="Admin" className="w-10 h-10 rounded-full border-2 border-[#00C2FF]" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsItems.map((s, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-[#00C2FF20] p-3 rounded-xl">{s.icon}</div>
                <div>
                  <h4 className="text-sm text-gray-500">{s.title}</h4>
                  <p className="text-xl font-semibold text-gray-800">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AnalyticsSection />
      </main>
    </div>
  );
}
