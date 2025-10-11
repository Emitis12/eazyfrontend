import React from "react";
import { BackTop } from "antd";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTopButton() {
  return (
    <BackTop visibilityHeight={600}> {/* 👈 only shows after 600px scroll */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFCF71] text-[#008BE0] shadow-lg cursor-pointer hover:bg-[#ffd983] transition-all duration-300"
        style={{
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <FaArrowUp size={20} />
      </div>
    </BackTop>
  );
}
