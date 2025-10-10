import React from "react";
import { Modal as AntModal } from "antd";

export default function Modal({
  title,
  open,
  onCancel,
  onOk,
  children,
  width = 600,
  okText = "Confirm",
  cancelText = "Cancel",
  footer = true,
}) {
  return (
    <AntModal
      title={<span className="text-gray-800 font-semibold text-lg sm:text-xl">{title}</span>}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      centered
      width={Math.min(width, window.innerWidth - 40)} // ensures it fits small screens
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        padding: "1rem",
      }}
      okButtonProps={{
        style: {
          backgroundColor: "#008BE0",
          borderColor: "#008BE0",
          color: "#fff",
          borderRadius: "8px",
        },
      }}
      cancelButtonProps={{
        style: {
          borderColor: "#ccc",
          borderRadius: "8px",
        },
      }}
      footer={footer ? undefined : null}
    >
      <div className="text-sm sm:text-base">{children}</div>
    </AntModal>
  );
}
