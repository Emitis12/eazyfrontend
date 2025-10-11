import React, { useState } from "react";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", form);
      setAuthToken("admin", res.data.token, true);
      notify.success("Admin Access Granted");
      navigate("/admin/dashboard");
    } catch (err) {
      notify.error("Login failed", err.response?.data?.message || "Try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 transition-transform duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-700">
          Admin Panel Login
        </h2>

        <Input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button
          label="Login"
          variant="primary"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
          type="submit"
        />
      </form>
    </div>
  );
}
