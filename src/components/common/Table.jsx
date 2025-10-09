import React from "react";
import { Table as AntTable, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { notify } from "./Notification";

/**
 * Premium reusable data table with actions
 */
export default function Table({
  columns,
  data,
  loading = false,
  pagination = true,
  bordered = false,
  size = "middle",
  notifyType, // "success" | "error" | "info" | "warning"
  notifyMsg,
  className = "",
  onEdit,
  onDelete,
  onView,
  ...rest
}) {
  const enhancedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {onView && (
            <Button
              type="text"
              icon={<EyeOutlined className="text-[#008BE0]" />}
              onClick={() => {
                onView(record);
                notify.info("Viewing Record", record.name || "Selected Item");
              }}
            />
          )}
          {onEdit && (
            <Button
              type="text"
              icon={<EditOutlined className="text-green-500" />}
              onClick={() => {
                onEdit(record);
                notify.success("Edit Mode", "You are editing this record.");
              }}
            />
          )}
          {onDelete && (
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              onClick={() => {
                onDelete(record);
                notify.warning("Record Deleted", "This item has been removed.");
              }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={`rounded-xl shadow-sm bg-white p-4 ${className}`}>
      <AntTable
        columns={enhancedColumns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        bordered={bordered}
        size={size}
        rowClassName="hover:bg-[#F0F9FF] transition-all duration-200 cursor-pointer"
        {...rest}
      />
    </div>
  );
}
