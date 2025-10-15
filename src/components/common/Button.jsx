import React, { useState } from "react";
import { Spin } from "antd";
import { notify } from "./Notification";

/**
 * 🌟 Premium Smart Button Component
 * Features:
 * - Async handler support (auto loading + notify)
 * - Premium gradient + hover glow
 * - Variants: primary | outline | ghost
 * - Smooth transitions and accessibility
 */

export default function Button({
  label,
  onClick,
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

  const baseStyles =
    "relative flex items-center justify-center px-6 py-2.5 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#009BFF]/40 active:scale-95 overflow-hidden";

  const variants = {
    primary: `
      bg-gradient-to-r from-[#008BE0] to-[#00AEEF] text-white shadow-[0_4px_14px_rgba(0,139,224,0.3)]
      hover:shadow-[0_6px_20px_rgba(0,155,255,0.5)]
      hover:brightness-110 hover:translate-y-[-1px]
      after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/10 after:to-transparent
      after:opacity-0 hover:after:opacity-20 after:transition-all after:duration-500
    `,
    outline: `
      border border-[#008BE0] text-[#008BE0]
      hover:bg-gradient-to-r hover:from-[#008BE0] hover:to-[#00AEEF] hover:text-white
      hover:shadow-[0_4px_14px_rgba(0,139,224,0.3)]
    `,
    ghost: `
      text-[#008BE0] hover:text-[#009BFF]
      hover:bg-[#008BE020] border border-transparent
    `,
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
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
