import React, { useState } from "react";
import Table from "../../components/common/Table";
import { Button } from "../../components/common/Button";

export default function Wallet() {
  const [balance, setBalance] = useState(1200); // example balance
  const [requesting, setRequesting] = useState(false);

  const handleWithdraw = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      alert("Withdrawal request submitted!");
    }, 1500);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Wallet</h3>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-500">Current Balance</p>
          <p className="text-3xl font-bold text-green-600">${balance}</p>
        </div>
        <Button
          label="Request Withdrawal"
          variant="primary"
          loading={requesting}
          onClick={handleWithdraw}
        />
      </div>

      <h4 className="text-xl font-semibold mb-2">Transaction History</h4>
      <Table type="wallet" />
    </div>
  );
}
