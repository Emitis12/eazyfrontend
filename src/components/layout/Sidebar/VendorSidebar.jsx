// src/components/layout/Sidebar/VendorSidebar.jsx
import React from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

/**
 * VendorSidebar component
 * @param {number} activeOrderCount - Number of active orders for badge display
 * @param {function} onActiveOrdersClick - Callback to open Active Orders modal
 */
export default function VendorSidebar({ activeOrderCount = 0, onActiveOrdersClick }) {
  // Get sidebar links for Vendor with dynamic badge and click callback
  const vendorLinks = getSidebarLinks("Vendor", activeOrderCount, onActiveOrdersClick);

  return <CommonSidebar links={vendorLinks} role="Vendor" />;
}
