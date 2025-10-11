import React, { useState } from "react";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { notifyAuthChange } from "../../utils/authEvents";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
    remember: false,
    countryCode: "+234",
    whatsapp: "",
    otp: "",
  });

  const [loginMethod, setLoginMethod] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ======================
  // 🔵 Email Login
  // ======================
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerName", user.name);
      notifyAuthChange();

      setAuthToken(form.role, token, form.remember);
      notify.success(`Welcome back, ${user.name}!`);
      navigate(`/${form.role}/dashboard`);
    } catch (err) {
      notify.error("Login failed", err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🟢 WhatsApp - Send OTP
  // ======================
  const handleWhatsAppLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phone = `${form.countryCode}${form.whatsapp}`;
    try {
      await API.post("/auth/send-otp", { phone });
      setOtpSent(true);
      notify.success(`OTP sent to WhatsApp number ${phone}`);
    } catch (err) {
      notify.error("Failed to send OTP", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🟢 WhatsApp - Verify OTP
  // ======================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const phone = `${form.countryCode}${form.whatsapp}`;
    try {
      const res = await API.post("/auth/verify-otp", { phone, otp: form.otp });
      const { token, user } = res.data;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerName", user.name);
      notifyAuthChange();

      setAuthToken(form.role, token, true);
      notify.success(`Welcome ${user.name}!`);
      navigate(`/${form.role}/dashboard`);
    } catch (err) {
      notify.error("OTP verification failed", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🔴 Google Login
  // ======================
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    localStorage.setItem("customerName", decoded.name);
    localStorage.setItem("customerToken", credentialResponse.credential);
    notifyAuthChange();
    notify.success(`Welcome ${decoded.name}`);
    navigate(`/${form.role}/dashboard`);
  };

  const handleGoogleError = () => {
    notify.error("Google login failed");
  };

  // ======================
  // 🌍 Country Code Options
  // ======================
  const countryCodes = [
    { code: "+234", label: "🇳🇬 NG" },
    { code: "+1", label: "🇺🇸 US" },
    { code: "+44", label: "🇬🇧 UK" },
    { code: "+91", label: "🇮🇳 IN" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          Welcome to Eazy
        </h2>

        {/* Role Selector */}
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

        {/* Login Method Buttons */}
        <div className="flex justify-between gap-2">
          {["email", "whatsapp", "google"].map((method) => (
            <Button
              key={method}
              label={method.charAt(0).toUpperCase() + method.slice(1)}
              className={`w-1/3 rounded-lg py-2 font-semibold ${
                loginMethod === method
                  ? method === "google"
                    ? "bg-red-500 text-white"
                    : method === "whatsapp"
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setLoginMethod(method);
                setOtpSent(false);
              }}
            />
          ))}
        </div>

        {/* ======================
            EMAIL LOGIN FORM
        ====================== */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-5">
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
            <div className="text-right mt-2">
  <a href="/forgot-password" className="text-blue-500 hover:underline">
    Forgot Password?
  </a>
</div>
            <Button
              label={loading ? "Logging in..." : "Login"}
              variant="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
              type="submit"
              disabled={loading}
            />
            

          </form>
        )}

        {/* ======================
            WHATSAPP LOGIN FORM
        ====================== */}
        {loginMethod === "whatsapp" && (
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleWhatsAppLogin}
            className="space-y-5"
          >
            {!otpSent ? (
              <>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="w-1/3 border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label} {c.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    name="whatsapp"
                    placeholder="WhatsApp Number"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-2/3"
                    required
                  />
                </div>
                <Button
                  label={loading ? "Sending OTP..." : "Send OTP"}
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
                  type="submit"
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <Input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span
                    className="text-green-600 cursor-pointer hover:underline"
                    onClick={handleWhatsAppLogin}
                  >
                    Resend OTP
                  </span>
                </div>
                <Button
                  label={loading ? "Verifying..." : "Verify OTP"}
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all"
                  type="submit"
                  disabled={loading}
                />
              </>
            )}
          </form>
        )}

        {/* ======================
            GOOGLE LOGIN BUTTON
        ====================== */}
        {loginMethod === "google" && (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              shape="pill"
              theme="filled_blue"
              text="signin_with"
            />
          </div>
        )}
      </div>
    </div>
  );
}
