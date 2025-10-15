import React, { useState, useEffect } from "react";
import API, { refreshToken } from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { notifyAuthChange } from "../../utils/authEvents";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Loginimg from "../../assets/logimg.png";

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
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (loginMethod === "email") {
      setCanSubmit(form.email && form.password);
    } else if (loginMethod === "whatsapp") {
      setCanSubmit(form.whatsapp && (otpSent ? form.otp : true));
    } else if (loginMethod === "google") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [form, loginMethod, otpSent]);

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

  const handleResendOtp = async () => {
    try {
      await refreshToken("customer", { otp: form.otp });
      notify.success("New OTP has been sent successfully.");
    } catch (err) {
      notify.error("Failed to resend OTP", err.response?.data?.message);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    localStorage.setItem("customerName", decoded.name);
    localStorage.setItem("customerToken", credentialResponse.credential);
    notifyAuthChange();
    notify.success(`Welcome ${decoded.name}`);
    navigate(`/${form.role}/dashboard`);
  };

  const handleGoogleError = () => notify.error("Google login failed");

  const countryCodes = [
    { code: "+234", label: "🇳🇬 NG" },
    { code: "+1", label: "🇺🇸 US" },
    { code: "+44", label: "🇬🇧 UK" },
    { code: "+91", label: "🇮🇳 IN" },
  ];

  const loginMethods = form.role === "customer" ? ["email", "whatsapp", "google"] : ["email"];

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${Loginimg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center text-[#008BE0]">Welcome to Eazy</h2>
        <div className="text-[#ffcf71] text-center">select your category</div>

        <select
          name="role"
          value={form.role}
          onChange={(e) => {
            handleChange(e);
            setLoginMethod("email");
            setOtpSent(false);
          }}
          className="w-full border-gray-300 rounded-lg p-3 outline-1 outline-black/30 focus:ring-2 focus:ring-[#008BE0]"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="rider">Rider</option>
        </select>

        {/* ✅ Upgraded Buttons to match Register UI */}
        {form.role === "customer" && (
          <div className="flex justify-between gap-3">
            {loginMethods.map((method) => {
              const label =
                method === "google"
                  ? "Google"
                  : method === "whatsapp"
                  ? "WhatsApp"
                  : "Email";

              const activeStyle =
                method === "google"
                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-400/40"
                  : method === "whatsapp"
                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-400/40"
                  : "bg-gradient-to-r from-[#008BE0] to-[#00C2FF] shadow-lg shadow-blue-400/40";

              return (
                <button
                  key={method}
                  onClick={() => setLoginMethod(method)}
                  className={`flex-1 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
                    loginMethod === method
                      ? `${activeStyle} scale-[1.03]`
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <Input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required validateOnBlur />
            <Input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required validateOnBlur />

            <div className="flex flex-col gap-1">
              <div className="flex justify-between w-full text-sm text-gray-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="accent-[#008BE0]" />
                  Remember me
                </label>
                <span onClick={() => navigate("/register")} className="text-[#008BE0] cursor-pointer hover:underline">
                  Create Account
                </span>
              </div>
              <div className="w-full text-right">
                <span onClick={() => navigate("/forgot-password")} className="text-[#008BE0] cursor-pointer hover:underline text-sm">
                  Forget Password?
                </span>
              </div>
            </div>

            <Button label={loading ? "Logging in..." : "Login"} variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all" type="submit" disabled={!canSubmit || loading} />
          </form>
        )}

        {loginMethod === "whatsapp" && form.role === "customer" && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleWhatsAppLogin} className="space-y-5">
            {!otpSent ? (
              <>
                <div className="flex gap-2">
                  <select name="countryCode" value={form.countryCode} onChange={handleChange} className="w-1/3 border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-400">
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label} {c.code}
                      </option>
                    ))}
                  </select>
                  <Input type="text" name="whatsapp" placeholder="WhatsApp Number" value={form.whatsapp} onChange={handleChange} required validateOnBlur className="w-2/3" />
                </div>
                <Button label={loading ? "Sending OTP..." : "Send OTP"} variant="primary" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all" type="submit" disabled={!canSubmit || loading} />
              </>
            ) : (
              <>
                <Input type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} required validateOnBlur />
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="text-green-600 cursor-pointer hover:underline" onClick={handleResendOtp}>
                    Resend OTP
                  </span>
                </div>
                <Button label={loading ? "Verifying..." : "Verify OTP"} variant="primary" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold shadow-md transition-all" type="submit" disabled={!canSubmit || loading} />
              </>
            )}
          </form>
        )}

        {loginMethod === "google" && form.role === "customer" && (
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} size="large" shape="pill" theme="filled_blue" text="signin_with" />
          </div>
        )}
      </div>
    </div>
  );
}
