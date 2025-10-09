import { notification } from "antd";

const defaultConfig = {
  placement: "topRight",
  duration: 3,
};

export const notify = {
  success: (message, description) =>
    notification.success({
      message,
      description,
      ...defaultConfig,
      style: { borderLeft: "4px solid #52c41a" },
    }),

  error: (message, description) =>
    notification.error({
      message,
      description,
      ...defaultConfig,
      style: { borderLeft: "4px solid #ff4d4f" },
    }),

  warning: (message, description) =>
    notification.warning({
      message,
      description,
      ...defaultConfig,
      style: { borderLeft: "4px solid #faad14" },
    }),

  info: (message, description) =>
    notification.info({
      message,
      description,
      ...defaultConfig,
      style: { borderLeft: "4px solid #1890ff" },
    }),
};
