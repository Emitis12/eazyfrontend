import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { motion } from "framer-motion";
import { ApiHelper } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/disp.jpeg"; // ✅ Add your background image here

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await ApiHelper.post("/auth/forgot-password", { email: values.email });
      message.success(res.message || "Password reset link sent to your email!");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-30"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <Title level={2} className="text-center text-blue-600 mb-2">
          Forgot Password
        </Title>
        <Text className="block text-center mb-6 text-gray-600">
          Enter your registered email address to reset your password.
        </Text>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="example@email.com" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Send Reset Link
          </Button>
        </Form>

        <div
        onClick={() => navigate("/login")}
        className="text-center mt-6 cursor-pointer text-blue-500 hover:underline">
          Back to Login
        </div>
      </motion.div>
    </div>
  );
}
