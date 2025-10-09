// src/pages/admin/Riders.jsx
import React from "react";
import AdminSidebar from "../../components/layout/sidebar/AdminSidebar";
import Table from "../../components/common/Table";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../components/common/Button";

export default function Riders() {
  const { data: riders, loading } = useFetch("/api/admin/riders");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Riders</h2>

        <div className="flex justify-end mb-4">
          <Button label="Add Rider" variant="primary" onClick={() => alert("Add Rider")} />
        </div>

        <Table
          columns={[
            { title: "ID", field: "id" },
            { title: "Name", field: "name" },
            { title: "Email", field: "email" },
            { title: "Phone", field: "phone" },
            { title: "Status", field: "status" },
          ]}
          data={riders || []}
          loading={loading}
          search
          filter
        />
      </main>
    </div>
  );
}
