import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loader = ({ size = 40, color = "#FFCF71" }) => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: size,
        color,
      }}
      spin
    />
  );

  return (
    <div className="flex items-center justify-center py-8">
      <Spin indicator={antIcon} />
    </div>
  );
};

export default Loader;
