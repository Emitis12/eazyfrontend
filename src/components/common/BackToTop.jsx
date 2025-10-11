// src/components/common/BackToTop.jsx
import React from "react";
import { FloatButton } from "antd";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTopButton() {
  return (
    <FloatButton.BackTop
      visibilityHeight={300} // Show button after scrolling 300px
      shape="circle"
      tooltip="Back to top"
      style={{
        right: 30,
        bottom: 50,
        backgroundColor: "#008BE0", // Eazy blue
        color: "white",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
      icon={<FaArrowUp />}
    />
  );
}
