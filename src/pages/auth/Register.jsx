import React, { useState } from "react";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      setAuthToken(form.role, res.data.token, true);
      notify.success("Welcome to Eazy!");
      navigate(`/${form.role}/dashboard`);
    } catch (err) {
      notify.error("Registration failed", err.response?.data?.message || "Try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 transition-transform duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          Create Eazy Account
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
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

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

        <Button
          label="Sign Up"
          variant="primary"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
          type="submit"
        />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
