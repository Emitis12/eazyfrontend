// src/pages/rider/Earnings.jsx
import React from "react";
import { Card } from "../../components/common/Card";

export default function Earnings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="This Week" value="$320" />
        <Card title="This Month" value="$1,280" />
        <Card title="Total" value="$4,560" />
      </div>
    </div>
  );
}
