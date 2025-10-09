// src/components/layout/Sidebar/VendorSidebar.jsx
import React from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

export default function VendorSidebar() {
  const vendorLinks = getSidebarLinks("Vendor");
  return <CommonSidebar links={vendorLinks} role="Vendor" />;
}
