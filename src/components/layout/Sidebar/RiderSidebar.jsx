// src/components/layout/Sidebar/RiderSidebar.jsx
import React, { useEffect, useState } from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

/**
 * RiderSidebar component
 * @param {number} newOrdersCount - Number of incoming delivery tasks
 * @param {function} onTasksViewed - Callback when rider views tasks (resets badge)
 */
export default function RiderSidebar({ newOrdersCount = 0, onTasksViewed }) {
  const [badgeCount, setBadgeCount] = useState(newOrdersCount);

  // Update badge dynamically when newOrdersCount changes
  useEffect(() => {
    setBadgeCount(newOrdersCount);
  }, [newOrdersCount]);

  // When rider clicks on Delivery Tasks
  const handleTasksClick = () => {
    setBadgeCount(0); // reset badge
    if (onTasksViewed) onTasksViewed();
  };

  // Get sidebar links with dynamic badge & click handler
  const riderLinks = getSidebarLinks("Rider", badgeCount, handleTasksClick);

  return <CommonSidebar links={riderLinks} role="Rider" />;
}
