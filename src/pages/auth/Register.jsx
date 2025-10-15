import React, { useEffect, useMemo, useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import RegBg from "../../assets/logimg.png";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaWhatsapp, FaGoogle, FaCheckCircle } from "react-icons/fa";

const Link = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-indigo-500 underline hover:text-indigo-700 transition-colors"
  >
    {children}
  </a>
);

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [submitting, setSubmitting] = useState(false);
  const [fade, setFade] = useState(false);

  const [registerMethod, setRegisterMethod] = useState("email");
  const [waCountryCode, setWaCountryCode] = useState("+234");
  const [waPhone, setWaPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(0);

  const [rider, setRider] = useState({
    city: "",
    vehicle: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verifyPassword: "",
    phone: "",
    accepted: false,
  });
  const [vendor, setVendor] = useState({
    firstName: "",
    lastName: "",
    businessType: "",
    phone: "",
    businessEmail: "",
    password: "",
    verifyPassword: "",
    accepted: false,
  });
  const [customer, setCustomer] = useState({
    city: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    verifyPassword: "",
    acceptedTerms: false,
  });

  const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano"];
  const vehicles = ["Bicycle", "Motorbike", "Car", "Tricycle (Keke)"];
  const businessTypes = ["Restaurant", "Grocery", "Pharmacy", "Retail"];

  const schemas = useMemo(
    () => ({
      rider: [
        { key: "city", type: "select", label: "Select city", options: cities },
        { key: "vehicle", type: "select", label: "Select vehicle", options: vehicles },
        {
          key: "nameRow",
          type: "inline",
          fields: [
            { key: "firstName", type: "text", placeholder: "First name" },
            { key: "lastName", type: "text", placeholder: "Last name" },
          ],
        },
        { key: "email", type: "email", placeholder: "Email" },
        {
          key: "passwordRow",
          type: "inline",
          fields: [
            { key: "password", type: "password", placeholder: "Password" },
            { key: "verifyPassword", type: "password", placeholder: "Verify password" },
          ],
        },
        { key: "phone", type: "tel", placeholder: "Phone number" },
      ],
      vendor: [
        {
          key: "nameRow",
          type: "inline",
          fields: [
            { key: "firstName", type: "text", placeholder: "First name" },
            { key: "lastName", type: "text", placeholder: "Last name" },
          ],
        },
        { key: "businessType", type: "select", label: "Choose business type", options: businessTypes },
        { key: "phone", type: "tel", placeholder: "Phone number" },
        { key: "businessEmail", type: "email", placeholder: "Business email" },
        {
          key: "passwordRow",
          type: "inline",
          fields: [
            { key: "password", type: "password", placeholder: "Password" },
            { key: "verifyPassword", type: "password", placeholder: "Verify password" },
          ],
        },
      ],
      customerEmail: [
        { key: "city", type: "select", label: "Select city", options: cities },
        {
          key: "nameRow",
          type: "inline",
          fields: [
            { key: "firstName", type: "text", placeholder: "First name" },
            { key: "lastName", type: "text", placeholder: "Last name" },
          ],
        },
        { key: "phone", type: "tel", placeholder: "Phone number" },
        {
          key: "passwordRow",
          type: "inline",
          fields: [
            { key: "password", type: "password", placeholder: "Password" },
            { key: "verifyPassword", type: "password", placeholder: "Verify password" },
          ],
        },
      ],
    }),
    [cities, vehicles, businessTypes]
  );

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => setFade(false), 400);
    return () => clearTimeout(timer);
  }, [role, registerMethod]);

  useEffect(() => {
    let timerId = null;
    if (timer > 0) timerId = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timer]);

  const change = (setter) => (key, value) => setter((prev) => ({ ...prev, [key]: value }));
  const handleRiderChange = change(setRider);
  const handleVendorChange = change(setVendor);
  const handleCustomerChange = change(setCustomer);

  const isRiderValid =
    Object.values(rider).every((v) => v !== "") && rider.password === rider.verifyPassword && rider.accepted;
  const isVendorValid =
    Object.values(vendor).every((v) => v !== "") && vendor.password === vendor.verifyPassword && vendor.accepted;
  const isCustomerValid =
    Object.values(customer).every((v) => v !== "") &&
    customer.password === customer.verifyPassword &&
    customer.acceptedTerms;

  const renderField = ({ type, key, label, placeholder, options }, value, onChange) => {
    const commonProps = {
      value: value || "",
      onChange: (e) => onChange(key, e.target.value),
      placeholder: placeholder || label || "",
      id: key,
    };

    if (type === "select") {
      return (
        <div className="w-full">
          <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <select
            {...commonProps}
            className="w-full rounded-md border-gray-200 shadow-sm p-2 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select {label?.toLowerCase?.() || key}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return <Input type={type} {...commonProps} className="w-full" />;
  };

  const renderSchema = (schema, data, onChange) =>
    schema.map((field) => {
      if (field.type === "inline") {
        return (
          <div key={field.key} className="flex flex-col sm:flex-row gap-3 w-full">
            {field.fields.map((f) => (
              <div key={f.key} className="flex-1">
                {renderField(f, data[f.key], onChange)}
              </div>
            ))}
          </div>
        );
      }
      return (
        <div key={field.key} className="w-full">
          {renderField(field, data[field.key], onChange)}
        </div>
      );
    });

  // ✅ handleSubmit with mail trigger added
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = role === "rider" ? rider : role === "vendor" ? vendor : customer;
      const res = await API.post(`/auth/register/${role}`, payload);
      setAuthToken(role, res.data.token);

      // ✅ Send mail trigger after successful registration
      if (role === "rider" || role === "customer") {
        try {
          await API.post("/mail/send", {
            to: payload.email || payload.businessEmail,
            subject: "Eazy Registration Under Review",
            body: `
              <h3>Hello ${payload.firstName},</h3>
              <p>Your registration is currently under review. Please wait for a verification mail before onboarding.</p>
              <p>Thank you for joining <strong>Eazy</strong> — Fast, Fresh, Eazy!</p>
            `,
          });
        } catch (mailErr) {
          console.warn("Mail trigger failed:", mailErr);
        }
      }

      notify(`Welcome ${payload.firstName || ""}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      notify(err?.response?.data?.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setOtpSent(true);
      setTimer(60);
      const fullPhone = `${waCountryCode}${waPhone}`;
      const res = await API.post("/auth/send-otp", { phone: fullPhone });
      notify("OTP sent to your WhatsApp!", "success");

      if (res?.data?.token) {
        setAuthToken("customer", res.data.token);
        notify("Session refreshed automatically", "info");
      }
    } catch (err) {
      setOtpSent(false);
      notify(err?.response?.data?.message || "Failed to send OTP", "error");
    }
  };

  const fadeClass = fade ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ backgroundImage: `url(${RegBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-gray-800">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Register as a <strong className="capitalize">{role}</strong>.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              {["customer", "vendor", "rider"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    role === r
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-white shadow-md hover:shadow-lg"
                      : "border border-gray-300 hover:border-indigo-500 hover:text-indigo-600"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Rider */}
              {role === "rider" && (
                <div className={`space-y-3 transform transition-all duration-500 ease-out ${fadeClass}`}>
                  {renderSchema(schemas.rider, rider, handleRiderChange)}
                  <div className="flex items-center gap-2">
                    <input
                      id="riderTerms"
                      type="checkbox"
                      checked={rider.accepted}
                      onChange={(e) => setRider((prev) => ({ ...prev, accepted: e.target.checked }))}
                    />
                    <label htmlFor="riderTerms" className="text-sm">
                      I accept the <Link href="#">Rider Privacy Statement</Link>.
                    </label>
                  </div>
                  <Button
                    label={submitting ? "Creating..." : "Register"}
                    type="submit"
                    variant="primary"
                    disabled={!isRiderValid || submitting}
                    className="w-full"
                  />
                </div>
              )}

              {/* Vendor */}
              {role === "vendor" && (
                <div className={`space-y-3 transform transition-all duration-500 ease-out ${fadeClass}`}>
                  {renderSchema(schemas.vendor, vendor, handleVendorChange)}
                  <div className="flex items-center gap-2">
                    <input
                      id="vendorTerms"
                      type="checkbox"
                      checked={vendor.accepted}
                      onChange={(e) => setVendor((prev) => ({ ...prev, accepted: e.target.checked }))}
                    />
                    <label htmlFor="vendorTerms" className="text-sm">
                      I accept the <Link href="#">Privacy Policy</Link>.
                    </label>
                  </div>
                  <Button
                    label={submitting ? "Creating..." : "Register"}
                    type="submit"
                    variant="primary"
                    disabled={!isVendorValid || submitting}
                    className="w-full"
                  />
                </div>
              )}

              {/* Customer */}
              {role === "customer" && (
                <div className={`space-y-3 transform transition-all duration-500 ease-out ${fadeClass}`}>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterMethod("whatsapp")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md w-1/3 text-sm font-medium transition-all ${
                        registerMethod === "whatsapp"
                          ? "bg-green-500 text-white"
                          : "border border-gray-300 hover:border-green-400"
                      }`}
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegisterMethod("google")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md w-1/3 text-sm font-medium transition-all ${
                        registerMethod === "google"
                          ? "bg-red-500 text-white"
                          : "border border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <FaGoogle /> Google
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegisterMethod("email")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md w-1/3 text-sm font-medium transition-all ${
                        registerMethod === "email"
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      <FaCheckCircle /> Email
                    </button>
                  </div>

                  {/* WhatsApp signup */}
                  {registerMethod === "whatsapp" && (
                    <div className={`transition-all duration-500 ${fadeClass}`}>
                      {!otpSent ? (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={waCountryCode}
                              onChange={(e) => setWaCountryCode(e.target.value)}
                              className="w-20 p-2 border rounded-md"
                            />
                            <input
                              type="text"
                              placeholder="WhatsApp phone"
                              value={waPhone}
                              onChange={(e) => setWaPhone(e.target.value)}
                              className="flex-1 p-2 border rounded-md"
                            />
                          </div>
                          <Button
                            label="Send OTP"
                            onClick={handleSendOtp}
                            className="mt-3 w-full"
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                          />
                          <Button
                            label={`Verify ${timer > 0 ? `(${timer})` : ""}`}
                            disabled={timer > 0}
                            className="mt-3 w-full"
                          />
                        </>
                      )}
                    </div>
                  )}

                  {/* Google signup */}
                  {registerMethod === "google" && (
                    <div className={`transition-all duration-500 ${fadeClass}`}>
                      <GoogleLogin
                        onSuccess={(res) => notify("Google login success", "success")}
                        onError={() => notify("Google login failed", "error")}
                      />
                    </div>
                  )}

                  {/* Email signup */}
                  {registerMethod === "email" && (
                    <div className={`space-y-3 transition-all duration-500 ${fadeClass}`}>
                      {renderSchema(schemas.customerEmail, customer, handleCustomerChange)}
                      <div className="flex items-center gap-2">
                        <input
                          id="custTerms"
                          type="checkbox"
                          checked={customer.acceptedTerms}
                          onChange={(e) =>
                            setCustomer((prev) => ({ ...prev, acceptedTerms: e.target.checked }))
                          }
                        />
                        <label htmlFor="custTerms" className="text-sm">
                          By creating account, you accept our{" "}
                          <Link href="#">Terms of Service</Link>,{" "}
                          <Link href="#">Privacy Policy</Link> and{" "}
                          <Link href="#">Cookies</Link>.
                        </label>
                      </div>
                      <Button
                        label={submitting ? "Creating..." : "Register"}
                        type="submit"
                        variant="primary"
                        disabled={!isCustomerValid || submitting}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="hidden md:flex md:w-1/2 p-6 flex-col justify-center items-start bg-white/50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800">Fast. Fresh. Eazy.</h2>
            <p className="mt-3 text-sm text-gray-700">
              Join thousands of vendors, riders and customers using Eazy to get food delivered quickly and safely.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>✅ Secure authentication</li>
              <li>✅ OTP verification for phone signups</li>
              <li>✅ Modern, responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div> 
  );
}
