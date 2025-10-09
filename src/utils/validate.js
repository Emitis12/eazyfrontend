// src/utils/validate.js
export const isEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isRequired = (value) => value !== undefined && value !== null && value !== "";

export const isMinLength = (value, length) => value.length >= length;

export const isMaxLength = (value, length) => value.length <= length;

export const validatePassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password); // 8 chars, letters+numbers

export const validateForm = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    const value = fields[key].value;
    const rules = fields[key].rules || [];
    rules.forEach((rule) => {
      if (rule === "required" && !isRequired(value)) {
        errors[key] = "This field is required";
      }
      if (rule === "email" && !isEmail(value)) {
        errors[key] = "Invalid email";
      }
      if (rule.min && !isMinLength(value, rule.min)) {
        errors[key] = `Minimum ${rule.min} characters`;
      }
      if (rule.max && !isMaxLength(value, rule.max)) {
        errors[key] = `Maximum ${rule.max} characters`;
      }
      if (rule === "password" && !validatePassword(value)) {
        errors[key] = "Password must be at least 8 characters and include a number";
      }
    });
  });
  return errors;
};
