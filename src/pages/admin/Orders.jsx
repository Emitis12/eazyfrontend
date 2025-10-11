// src/pages/admin/Orders.jsx
import React from "react";
import AdminSidebar from "../../components/layout/sidebar/AdminSidebar";
import Table from "../../components/common/Table";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../components/common/Button";

export default function Orders() {
  const { data: orders, loading } = useFetch("/api/admin/orders");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Orders</h2>

        <Table
          columns={[
            { title: "Order ID", field: "id" },
            { title: "Customer", field: "customer" },
            { title: "Vendor", field: "vendor" },
            { title: "Amount", field: "amount" },
            { title: "Status", field: "status" },
            { title: "Date", field: "date" },
          ]}
          data={orders || []}
          loading={loading}
          search
          filter
        />
      </main>
    </div>
  );
}
