// src/components/layout/Sidebar/RiderSidebar.jsx
import React, { useEffect, useState } from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

export default function RiderSidebar({ newOrdersCount, onTasksViewed }) {
  const [badgeCount, setBadgeCount] = useState(newOrdersCount || 0);

  useEffect(() => {
    setBadgeCount(newOrdersCount || 0);
  }, [newOrdersCount]);

  const handleTasksClick = () => {
    setBadgeCount(0);
    if (onTasksViewed) onTasksViewed();
  };

  const riderLinks = getSidebarLinks("Rider", badgeCount, handleTasksClick);
  return <CommonSidebar links={riderLinks} role="Rider" />;
}
