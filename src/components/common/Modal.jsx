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
      title={<span className="text-gray-800 font-semibold">{title}</span>}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      width={width}
      okButtonProps={{
        style: {
          backgroundColor: "#FFCF71",
          borderColor: "#FFCF71",
          color: "#000",
        },
      }}
      cancelButtonProps={{
        style: {
          borderColor: "#ccc",
        },
      }}
      footer={footer ? undefined : null}
    >
      {children}
    </AntModal>
  );
}
