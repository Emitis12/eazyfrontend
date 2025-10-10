import React, { useState } from "react";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
    remember: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      setAuthToken(form.role, res.data.token, form.remember);
      notify.success("Welcome back to Eazy!");
      navigate(`/${form.role}/dashboard`);
    } catch (err) {
      notify.error("Login failed", err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 transition-transform duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          Welcome to Eazy
        </h2>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="rider">Rider</option>
        </select>

        <Input
          type="email"
          name="email"
          placeholder="Email Address"
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

        <div className="flex items-center justify-between text-sm text-gray-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="accent-blue-600"
            />
            Remember me
          </label>
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </div>

        <Button
          label="Login"
          variant="primary"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
          type="submit"
        />
      </form>
    </div>
  );
}
