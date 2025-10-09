// src/components/layout/Sidebar/UserSidebar.jsx
import React from "react";
import CommonSidebar from "../../common/SideBar";
import { getSidebarLinks } from "../../../utils/SidebarHelper";

export default function UserSidebar() {
  const userLinks = getSidebarLinks("User");
  return <CommonSidebar links={userLinks} role="User" />;
}
