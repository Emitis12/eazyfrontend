// src/pages/rider/DeliveryTasks.jsx
import React from "react";
import { Table } from "../../components/common/Table";

const deliveries = [
  { id: 1, customer: "John Doe", address: "Lagos", status: "Pending" },
  { id: 2, customer: "Jane Smith", address: "Abuja", status: "In Progress" },
  { id: 3, customer: "Aliyu Bello", address: "Port Harcourt", status: "Completed" },
];

export default function DeliveryTasks() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Delivery Tasks</h2>
      <Table data={deliveries} columns={["id", "customer", "address", "status"]} />
    </div>
  );
}
