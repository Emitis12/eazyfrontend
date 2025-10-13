import React, { useState, useEffect, forwardRef } from "react";
import { Input as AntInput } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// Use forwardRef to properly pass ref to AntInput
const Input = forwardRef(({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  icon: Icon,
  disabled = false,
  className = "",
  required = false,
  validate, // function: (value) => errorMessage | null
  preventCopyPaste = false,
  validateOnBlur = true, // true: validate on blur, false: validate on change
  error: parentError, // parent-controlled error
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState("");

  const inputType = type === "password" && showPassword ? "text" : type;

  // Sync parent error
  useEffect(() => {
    setInternalError(parentError || "");
  }, [parentError]);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange && onChange(e);

    if (validate && !validateOnBlur) {
      const err = validate(val) || "";
      setInternalError(err);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (validate && validateOnBlur) {
      const err = validate(value) || "";
      setInternalError(err);
    }
  };

  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      {label && (
        <label
          className={`absolute left-3 text-gray-500 text-sm transition-all pointer-events-none
          ${focused || value ? "-top-2 text-xs text-[#008BE0]" : "top-3"}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />}

        <AntInput
          ref={ref} // forward ref to AntInput
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full py-2.5 outline-1 outline-gray-300 rounded-xl border px-3 ${
            Icon ? "pl-10" : "pl-3"
          } ${
            internalError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
          } focus:shadow-md transition-all`}
          onCopy={(e) => preventCopyPaste && e.preventDefault()}
          onPaste={(e) => preventCopyPaste && e.preventDefault()}
          {...rest}
        />

        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        )}
      </div>

      {internalError && <p className="text-red-500 text-xs mt-1">{internalError}</p>}
    </div>
  );
});

export default Input;
