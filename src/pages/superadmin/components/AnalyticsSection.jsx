import React from "react";
import { Card, CardContent } from "../../../components/common/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useSuperAdmin } from "../SuperAdminContext";

const salesData = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 600 },
  { month: "Mar", sales: 800 },
  { month: "Apr", sales: 700 },
  { month: "May", sales: 1100 },
  { month: "Jun", sales: 900 },
];

const usersData = [
  { day: "Mon", users: 20 },
  { day: "Tue", users: 35 },
  { day: "Wed", users: 25 },
  { day: "Thu", users: 50 },
  { day: "Fri", users: 70 },
  { day: "Sat", users: 40 },
];

export default function AnalyticsSection() {
  const { stats } = useSuperAdmin();

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Monthly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#008BE0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Weekly New Users</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#00C2FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm text-gray-500">Vendors (approved / pending)</h4>
            <p className="text-xl font-semibold text-gray-800">
              {(stats.vendors.approved || 0)} / {(stats.vendors.pending || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm text-gray-500">Riders (approved / pending)</h4>
            <p className="text-xl font-semibold text-gray-800">
              {(stats.riders.approved || 0)} / {(stats.riders.pending || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm text-gray-500">Customers</h4>
            <p className="text-xl font-semibold text-gray-800">{stats.customers.total || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm text-gray-500">Products</h4>
            <p className="text-xl font-semibold text-gray-800">{stats.products.total || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
