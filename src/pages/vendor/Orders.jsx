import React from "react";
import Table from "../../components/common/Table";
import { Button } from "../../components/common/Button";

export default function Orders() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Orders</h3>
        <Button label="Add Order" variant="primary" />
      </div>
      <Table type="orders" />
    </div>
  );
}
