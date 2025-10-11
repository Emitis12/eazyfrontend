import React from "react";
import { Select, DatePicker } from "antd";
import Button from "./Button";

/**
 * Filter bar for table data — supports dropdowns and date filters
 */
export default function FilterBar({
  filters = [],
  onApply,
  onReset,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap gap-3 items-center ${className}`}>
      {filters.map((filter, idx) => {
        if (filter.type === "select") {
          return (
            <Select
              key={idx}
              placeholder={filter.placeholder}
              onChange={(val) => filter.onChange(val)}
              options={filter.options}
              className="min-w-[160px]"
            />
          );
        }
        if (filter.type === "date") {
          return (
            <DatePicker
              key={idx}
              placeholder={filter.placeholder}
              onChange={(date) => filter.onChange(date)}
              className="min-w-[160px]"
            />
          );
        }
        return null;
      })}

      <Button
        label="Apply"
        variant="primary"
        onClick={onApply}
        className="px-5"
      />
      <Button
        label="Reset"
        variant="outline"
        onClick={onReset}
        className="px-5"
      />
    </div>
  );
}
