// src/pages/admin/Users.jsx
import React from "react";
import AdminSidebar from "../../components/layout/sidebar/AdminSidebar";
import Table from "../../components/common/Table";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../components/common/Button";

export default function Users() {
  const { data: users, loading } = useFetch("/api/admin/users");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Users</h2>

        <div className="flex justify-end mb-4">
          <Button label="Add User" variant="primary" onClick={() => alert("Add User")} />
        </div>

        <Table
          columns={[
            { title: "ID", field: "id" },
            { title: "Name", field: "name" },
            { title: "Email", field: "email" },
            { title: "Role", field: "role" },
            { title: "Status", field: "status" },
          ]}
          data={users || []}
          loading={loading}
          search
          filter
        />
      </main>
    </div>
  );
}
