import React, { useEffect, useState } from "react";
import { useSuperAdmin } from "../SuperAdminContext";
import { Card, CardContent } from "../../../components/common/Card";
import Button from "../../../components/common/Button";

export default function SuperAdminVendorApproval() {
  const { pendingVendors, approveVendor, rejectVendor, loading, fetchStats } = useSuperAdmin();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    // ensure stats/pending are current (context already fetches on mount)
  }, []);

  const handleApprove = async (id) => {
    setLocalLoading(true);
    await approveVendor(id);
    await fetchStats();
    setLocalLoading(false);
  };

  const handleReject = async (id) => {
    setLocalLoading(true);
    await rejectVendor(id);
    await fetchStats();
    setLocalLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Vendor Approvals</h2>
      <div className="grid grid-cols-1 gap-4">
        {pendingVendors.length === 0 && <p className="text-sm text-gray-500">No pending vendor approvals.</p>}
        {pendingVendors.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold">{v.businessName || `${v.firstName} ${v.lastName}`}</h3>
                <p className="text-sm text-gray-600">{v.businessType}</p>
                <p className="text-sm text-gray-500 mt-2">{v.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button label="Approve" onClick={() => handleApprove(v.id)} className="bg-green-600 text-white" />
                <Button label="Reject" onClick={() => handleReject(v.id)} className="bg-red-200 text-red-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
