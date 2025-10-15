import React, { useEffect, useState } from "react";
import { useSuperAdmin } from "../SuperAdminContext";
import { Card, CardContent } from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function SuperAdminRiderApproval() {
  const { pendingRiders, approveRider, rejectRider, fetchStats } = useSuperAdmin();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {}, []);

  const handleApprove = async (id) => {
    setLocalLoading(true);
    await approveRider(id);
    await fetchStats();
    setLocalLoading(false);
  };

  const handleReject = async (id) => {
    setLocalLoading(true);
    await rejectRider(id);
    await fetchStats();
    setLocalLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rider Approvals</h2>
      <div className="grid grid-cols-1 gap-4">
        {pendingRiders.length === 0 && <p className="text-sm text-gray-500">No pending rider approvals.</p>}
        {pendingRiders.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold">{`${r.firstName} ${r.lastName}`}</h3>
                <p className="text-sm text-gray-600">Vehicle: {r.vehicle || "N/A"}</p>
                <p className="text-sm text-gray-500 mt-2">{r.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button label="Approve" onClick={() => handleApprove(r.id)} className="bg-green-600 text-white" />
                <Button label="Reject" onClick={() => handleReject(r.id)} className="bg-red-200 text-red-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
