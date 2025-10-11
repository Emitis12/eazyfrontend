import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/**
 * Reusable search bar for tables or lists
 */
export default function SearchBar({ placeholder = "Search...", onSearch, className = "" }) {
  return (
    <div className={`flex items-center w-full max-w-sm ${className}`}>
      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="rounded-full py-2.5 px-4 border-gray-300 focus:border-[#008BE0]"
      />
    </div>
  );
}
