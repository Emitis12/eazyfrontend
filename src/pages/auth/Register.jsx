import React, { useState } from "react";
import API from "../../utils/api";
import { setAuthToken } from "../../utils/auth";
import { notify } from "../../components/common/Notification";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import RegImg from "../../assets/regimg.jpeg";
import { GoogleLogin } from "@react-oauth/google";
import { FaWhatsapp, FaGoogle, FaCheckCircle } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "customer",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    countryCode: "+234",
    password: "",
    verifyPassword: "",
    businessType: "",
    city: "",
    vehicle: "",
    privacyAccepted: false,
    updatesAccepted: false,
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("whatsapp");

  // ---------- VALIDATION ----------
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.trim() ? "" : "This field is required";
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Invalid email address";
      case "phone":
      case "whatsapp":
        return value.trim() ? "" : "Phone number is required";
      case "password":
        return value.length >= 6 ? "" : "Password must be at least 6 characters";
      case "verifyPassword":
        return value === form.password ? "" : "Passwords do not match";
      case "businessType":
      case "city":
      case "vehicle":
        return value ? "" : "This field is required";
      case "privacyAccepted":
        return value ? "" : "You must accept the privacy policy";
      default:
        return "";
    }
  };

  // ---------- HANDLE CHANGE ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({ ...prev, [name]: fieldValue }));

    // Only validate checkbox live
    if (type === "checkbox") {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, fieldValue) }));
    }
  };

  // ---------- HANDLE BLUR ----------
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, fieldValue) }));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFields = Object.keys(form);
    const newErrors = {};
    allFields.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return notify.error("Please fix all errors before submitting");
    }

    try {
      const res = await API.post("/auth/register", form);
      setAuthToken(form.role, res.data.token, true);
      notify.success("Welcome to Eazy!");
      navigate(`/${form.role}/dashboard`);
    } catch (err) {
      notify.error("Registration failed", err.response?.data?.message || "Try again");
    }
  };

  // ---------- RENDER INPUT ----------
  const renderInputs = (fields) =>
    fields.map(({ name, type, placeholder }, index) => {
      const hasError = errors[name];
      const isValid = touched[name] && !hasError && form[name];
      return (
        <div key={name} className="relative mb-2">
          <Input
            type={type}
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoFocus={index === 0} // ensure cursor stays active for first input
          />
          {hasError && <div className="text-red-500 text-xs mt-1">{hasError}</div>}
          {isValid && <FaCheckCircle className="absolute right-3 top-3 text-green-500 text-lg" />}
        </div>
      );
    });

  // ---------- CHECKBOX ----------
  const Checkbox = ({ name, label }) => {
    const hasError = errors[name];
    const isValid = touched[name] && !hasError && form[name];
    return (
      <label className="flex items-center space-x-2 text-sm text-gray-700 relative">
        <input
          type="checkbox"
          name={name}
          checked={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-4 h-4"
        />
        <span>{label}</span>
        {hasError && <div className="text-red-500 text-xs mt-1 absolute -bottom-5">{hasError}</div>}
        {isValid && <FaCheckCircle className="text-green-500 text-sm ml-2" />}
      </label>
    );
  };

  // ---------- CUSTOMER FORM ----------
  const CustomerForm = () => {
    const countryCodes = [
      { code: "+234", label: "🇳🇬" },
      { code: "+233", label: "🇬🇭" },
      { code: "+44", label: "🇬🇧" },
      { code: "+1", label: "🇺🇸" },
    ];

    const handleWhatsAppLogin = async () => {
      if (!form.whatsapp) return notify.error("Enter WhatsApp number first.");
      setLoading(true);
      try {
        await API.post("/auth/send-otp", { phone: `${form.countryCode}${form.whatsapp}` });
        setOtpSent(true);
        notify.success("OTP sent to your WhatsApp!");
      } catch {
        notify.error("Failed to send OTP");
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyOtp = async () => {
      if (!form.otp) return notify.error("Enter OTP first.");
      setLoading(true);
      try {
        await API.post("/auth/verify-otp", { phone: `${form.countryCode}${form.whatsapp}`, otp: form.otp });
        notify.success("OTP verified! Welcome to Eazy.");
        navigate("/customer/dashboard");
      } catch {
        notify.error("Invalid OTP, please try again.");
      } finally {
        setLoading(false);
      }
    };

    const handleGoogleSuccess = () => {
      notify.success("Google login successful!");
      navigate("/customer/dashboard");
    };

    const handleGoogleError = () => notify.error("Google login failed.");

    return (
      <>
        {!showEmailForm && !otpSent && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setLoginMethod("whatsapp")}
              type="button"
              className={`flex items-center justify-center gap-2 w-1/2 py-3 rounded-lg font-semibold shadow-md transition-all ${loginMethod === "whatsapp" ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-100 text-gray-700 hover:bg-green-100"}`}
            >
              <FaWhatsapp className="text-xl" /> WhatsApp
            </button>
            <button
              onClick={() => setLoginMethod("google")}
              type="button"
              className={`flex items-center justify-center gap-2 w-1/2 py-3 rounded-lg font-semibold shadow-md transition-all ${loginMethod === "google" ? "bg-[#4285F4] text-white hover:bg-[#357AE8]" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
            >
              <FaGoogle className="text-lg" /> Google
            </button>
          </div>
        )}

        {loginMethod === "whatsapp" && !showEmailForm && (
          <div className="space-y-5 mt-5">
            {!otpSent ? (
              <>
                <div className="flex gap-2 relative">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-1/3 border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    name="whatsapp"
                    placeholder="WhatsApp Number"
                    value={form.whatsapp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-2/3"
                    autoFocus
                  />
                  {touched.whatsapp && !errors.whatsapp && form.whatsapp && <FaCheckCircle className="text-green-500 text-lg absolute right-4 top-3" />}
                </div>
                {errors.whatsapp && <div className="text-red-500 text-xs">{errors.whatsapp}</div>}
                <Button
                  label={loading ? "Sending OTP..." : "Send OTP"}
                  onClick={handleWhatsAppLogin}
                  disabled={!form.whatsapp || loading || errors.whatsapp}
                  className={`w-full py-3 rounded-lg font-semibold ${(!form.whatsapp || errors.whatsapp) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                  type="button"
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
                  onBlur={handleBlur}
                  autoFocus
                />
                <Button
                  label={loading ? "Verifying..." : "Verify OTP"}
                  onClick={handleVerifyOtp}
                  disabled={!form.otp || loading}
                  className={`w-full py-3 rounded-lg font-semibold ${!form.otp ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                  type="button"
                />
              </>
            )}
          </div>
        )}

        {loginMethod === "google" && !showEmailForm && (
          <div className="flex justify-center mt-5">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} size="large" theme="filled_blue" />
          </div>
        )}

        {!showEmailForm && (
          <Button
            label="Register with Email"
            className="w-full bg-[#008BE0] hover:bg-blue-700 text-white rounded-lg py-3 font-semibold mt-5"
            onClick={() => setShowEmailForm(true)}
            type="button"
          />
        )}

        {showEmailForm && (
          <>
            <div className="flex gap-2">
              {renderInputs([
                { name: "firstName", type: "text", placeholder: "First Name" },
                { name: "lastName", type: "text", placeholder: "Last Name" },
              ])}
            </div>
            {renderInputs([
              { name: "email", type: "email", placeholder: "Email Address" },
              { name: "phone", type: "tel", placeholder: "Phone Number" },
              { name: "password", type: "password", placeholder: "Password" },
              { name: "verifyPassword", type: "password", placeholder: "Verify Password" },
            ])}

            <Button
              label="Sign Up"
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-[#008BE0] text-white hover:bg-blue-700"
            />
          </>
        )}
      </>
    );
  };

  // ---------- VENDOR FORM ----------
  const VendorForm = () => {
    return (
      <>
        <div className="flex gap-2">{renderInputs([{name:"firstName",type:"text",placeholder:"First Name"},{name:"lastName",type:"text",placeholder:"Last Name"}])}</div>

        <select
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className="w-full border-gray-300 rounded-lg p-3 outline-1 outline-gray-300 focus:ring-2 focus:ring-blue-400 relative"
        >
          <option value="">Select Business Type</option>
          <option value="restaurant">Restaurant</option>
          <option value="food_vendor">Food Vendor</option>
          <option value="catering">Catering</option>
          <option value="bakery">Bakery</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="eatary">Eatary</option>
          <option value="electronics">Electronics</option>
        </select>
        {touched.businessType && !errors.businessType && form.businessType && <FaCheckCircle className="text-green-500 absolute right-3 top-3"/>}
        {errors.businessType && <div className="text-red-500 text-xs">{errors.businessType}</div>}

        <div className="flex gap-2">{renderInputs([{name:"phone",type:"tel",placeholder:"Phone Number"},{name:"email",type:"email",placeholder:"Business Email"}])}</div>
        {renderInputs([{name:"password",type:"password",placeholder:"Password"},{name:"verifyPassword",type:"password",placeholder:"Verify Password"}])}

        <Checkbox name="updatesAccepted" label="I'd like updates via WhatsApp or email" />
        <Checkbox name="privacyAccepted" label={<span>I accept the <a href="/privacy-policy" className="text-[#008BE0] hover:underline font-semibold">Privacy Policy</a></span>} />

        <Button label="Register as Vendor" type="submit" className="w-full bg-[#008BE0] hover:bg-blue-700 text-white rounded-lg py-3 font-semibold"/>
      </>
    );
  };

  // ---------- RIDER FORM ----------
  const RiderForm = () => {
    const steps = [
      {
        id: 1,
        content: (
          <>
            <select name="city" value={form.city} onChange={handleChange} onBlur={handleBlur} required className="w-full border-gray-300 rounded-lg p-3">
              <option value="">Select City</option>
              {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((city) => (<option key={city}>{city}</option>))}
            </select>
            {touched.city && !errors.city && form.city && <FaCheckCircle className="text-green-500 absolute right-3 top-3"/>}
            {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
            <Button label="Next" onClick={()=>setStep(2)} className="w-full bg-[#008BE0] text-white py-2 rounded-lg text-sm mt-3" type="button"/>
          </>
        ),
      },
      {
        id:2,
        content: (
          <>
            <select name="vehicle" value={form.vehicle} onChange={handleChange} onBlur={handleBlur} required className="w-full border-gray-300 rounded-lg p-3">
              <option value="">Select Vehicle Type</option>
              {["Motorcycle", "Tricycle", "Bicycle", "Electric Bike"].map(v=> (<option key={v}>{v}</option>))}
            </select>
            {touched.vehicle && !errors.vehicle && form.vehicle && <FaCheckCircle className="text-green-500 absolute right-3 top-3"/>}
            {errors.vehicle && <div className="text-red-500 text-xs">{errors.vehicle}</div>}
            <div className="flex justify-between gap-3 mt-3">
              <Button label="Back" onClick={()=>setStep(1)} className="w-1/2 bg-gray-300 text-gray-700 rounded-lg py-2 text-sm" type="button"/>
              <Button label="Next" onClick={()=>setStep(3)} className="w-1/2 bg-[#008BE0] text-white rounded-lg py-2 text-sm" type="button"/>
            </div>
          </>
        )
      },
      {
        id:3,
        content: (
          <>
            {renderInputs([
              { name:"firstName", type:"text", placeholder:"First Name" },
              { name:"lastName", type:"text", placeholder:"Last Name" },
              { name:"email", type:"email", placeholder:"Email Address" },
              { name:"password", type:"password", placeholder:"Password" },
              { name:"verifyPassword", type:"password", placeholder:"Verify Password" },
              { name:"phone", type:"tel", placeholder:"Phone Number" }
            ])}
            <div className="flex justify-between gap-3 mt-3">
              <Button label="Back" onClick={()=>setStep(2)} className="w-1/2 bg-gray-300 text-gray-700 rounded-lg py-2 text-sm" type="button"/>
              <Button label="Next" onClick={()=>setStep(4)} className="w-1/2 bg-[#008BE0] text-white rounded-lg py-2 text-sm" type="button"/>
            </div>
          </>
        )
      },
      {
        id:4,
        content: (
          <>
            <Checkbox name="privacyAccepted" label={<span>I accept the <a href="/rider-privacy" className="text-[#008BE0] hover:underline font-semibold">Rider Privacy Statement</a></span>} />
            <div className="border-2 border-gray-300 rounded-lg p-4 text-center text-gray-600 text-sm mt-2">✅ Verify with Cloudflare</div>
            <div className="flex justify-between gap-3 mt-3">
              <Button label="Back" onClick={()=>setStep(3)} className="w-1/2 bg-gray-300 text-gray-700 rounded-lg py-2 text-sm" type="button"/>
              <Button label="Register as Rider" type="submit" className="w-1/2 bg-[#008BE0] text-white rounded-lg py-2 text-sm"/>
            </div>
          </>
        )
      }
    ];

    return steps.find(s=>s.id===step)?.content || null;
  };

  // ---------- MAIN RETURN ----------
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4" style={{ backgroundImage: `url(${RegImg})` }}>
      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center text-[#008BE0]">Create Eazy Account</h2>
        <div className="text-[#FFCF71] text-sm text-center">Choose your category</div>

        <select
          name="role"
          value={form.role}
          onChange={(e) => {
            const selectedRole = e.target.value;
            setForm((prev) => ({ ...prev, role: selectedRole }));
            setStep(1);
            setShowEmailForm(false);
            setOtpSent(false);
          }}
          className="w-full border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="rider">Rider</option>
        </select>

        {form.role === "customer" && <CustomerForm />}
        {form.role === "vendor" && <VendorForm />}
        {form.role === "rider" && <RiderForm />}
      </form>x
    </div>
  );
}
