import React, { useState } from "react";
import { Spin } from "antd";
import { notify } from "./Notification";

/**
 * 🔹 Premium Smart Button Component
 * Features:
 * - Async handler support (auto loading + notify)
 * - Built-in Ant Design notifications
 * - Variants: primary | outline | ghost
 * - Custom class override support
 */

export default function Button({
  label,
  onClick, // Can be async
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  icon: Icon,
  successMsg = { title: "Success", desc: "Action completed successfully." },
  errorMsg = { title: "Error", desc: "Something went wrong. Please try again." },
  notifyOnSuccess = true,
  notifyOnError = true,
  ...rest
}) {
  const [loading, setLoading] = useState(false);

  // ✅ Handles both sync and async logic
  const handleClick = async (e) => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      const result = onClick && (await onClick(e));
      if (notifyOnSuccess) notify.success(successMsg.title, successMsg.desc);
      return result;
    } catch (err) {
      if (notifyOnError)
        notify.error(errorMsg.title, errorMsg.desc || err.message);
      console.error("Button action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Styling presets
  const baseStyles =
    "flex items-center justify-center px-5 py-2.5 rounded-full font-semibold transition-all duration-300 focus:outline-none active:scale-95";

  const variants = {
    primary:
      "bg-[#008BE0] hover:bg-[#009BFF] text-white shadow-md hover:shadow-lg",
    outline:
      "border border-[#008BE0] text-[#008BE0] hover:bg-[#008BE0] hover:text-white",
    ghost:
      "text-[#008BE0] hover:text-[#009BFF] hover:bg-[#008BE020] border border-transparent",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Spin size="small" />
      ) : (
        <>
          {Icon && <Icon className="mr-2 text-lg" />}
          {label}
        </>
      )}
    </button>
  );
}
