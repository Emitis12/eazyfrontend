// src/components/layout/Sidebar/AdminSidebar.jsx
import React from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

export default function AdminSidebar() {
  const adminLinks = getSidebarLinks("Admin");
  return <CommonSidebar links={adminLinks} role="Admin" />;
}
