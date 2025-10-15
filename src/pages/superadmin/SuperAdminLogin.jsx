import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { Spin } from "antd";
import { notify } from "../../components/common/Notification";
import API from "../../utils/api";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return notify.error("Missing Fields", "Enter email and password");

    setLoading(true);
    try {
      const res = await API.post("/superadmin/login", { email, password });
      localStorage.setItem("superToken", res.data.token);
      notify.success("Login Successful", "Welcome Super Admin");
      navigate("/superadmin/dashboard");
    } catch (err) {
      notify.error("Login Failed", err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#008BE0] to-[#00C2FF] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-5xl text-[#008BE0] mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Super Admin Login</h2>
          <p className="text-gray-500 text-sm">Manage the Eazy platform securely</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#00C2FF] focus:outline-none transition-all"
              placeholder="admin@eazy.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#00C2FF] focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#008BE0] hover:bg-[#009BFF] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            {loading ? <Spin size="small" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
