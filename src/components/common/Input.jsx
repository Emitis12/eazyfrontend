import React, { useState } from "react";
import { Input as AntInput } from "antd";
import { notify } from "./Notification";

/**
 * Premium Input component with validation, icons, and built-in notifications
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  icon: Icon,
  notifyType, // "success" | "error" | "info" | "warning"
  notifyMsg,
  disabled = false,
  className = "",
  required = false,
  validate, // function: (value) => errorMessage | null
  ...rest
}) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange && onChange(e);

    // Run validation if function provided
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError || "");
    }

    // Trigger notification if specified
    if (notifyType && notifyMsg) {
      notify[notifyType](notifyMsg.title, notifyMsg.desc);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        )}
        <AntInput
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-${Icon ? "10" : "4"} py-2.5 rounded-full border ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-[#008BE0]"
          } focus:shadow-md transition-all`}
          {...rest}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
