// src/utils/SidebarHelper.jsx
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaGift,
  FaWallet,
  FaChartLine,
  FaMotorcycle,
  FaStore,
  FaHeart,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

/**
 * Returns sidebar links based on user role.
 * @param {string} role - User role (Admin, Vendor, Rider, User)
 * @param {number} badgeCount - Optional badge count for dynamic display
 * @param {function} handleTasksClick - Optional callback for Active Orders / Tasks click
 * @returns {Array} Array of sidebar link objects
 */
export const getSidebarLinks = (role, badgeCount = 0, handleTasksClick) => {
  switch (role) {
    case "Admin":
      return [
        { label: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
        { label: "Users", path: "/admin/users", icon: FaUsers },
        { label: "Vendors", path: "/admin/vendors", icon: FaBoxOpen },
        { label: "Orders", path: "/admin/orders", icon: FaGift },
        { label: "Reports", path: "/admin/reports", icon: FaChartLine },
      ];

    case "Vendor":
      return [
        { label: "Dashboard", path: "/vendor/dashboard", icon: FaTachometerAlt },
        { 
          label: "Active Orders", 
          path: "/vendor/active-orders", 
          icon: FaBoxOpen, 
          badge: badgeCount > 0 ? badgeCount : null, // dynamic badge
          onClick: handleTasksClick, // opens modal
        },
        { label: "Orders", path: "/vendor/orders", icon: FaBoxOpen },
        { label: "Products", path: "/vendor/products", icon: FaGift },
        { label: "Offers", path: "/vendor/offers", icon: FaGift },
        { label: "Wallet", path: "/vendor/wallet", icon: FaWallet },
        { label: "Reports", path: "/vendor/reports", icon: FaChartLine },
      ];

    case "Rider":
      return [
        { label: "Dashboard", path: "/rider/dashboard", icon: FaTachometerAlt },
        {
          label: "Delivery Tasks",
          path: "/rider/tasks",
          icon: FaMotorcycle,
          badge: badgeCount > 0 ? badgeCount : null,
          onClick: handleTasksClick,
        },
        { label: "Earnings", path: "/rider/earnings", icon: FaWallet },
      ];

    case "User":
      return [
        { label: "Dashboard", path: "/user/dashboard", icon: FaTachometerAlt },
        { label: "Orders", path: "/user/orders", icon: FaBoxOpen },
        { label: "Wishlist", path: "/user/wishlist", icon: FaHeart },
        { label: "Profile", path: "/user/profile", icon: FaUser },
        { label: "Marketplace", path: "/user/marketplace", icon: FaStore },
        { label: "Send a Rider", path: "/user/send-parcel", icon: FaPaperPlane },
      ];

    default:
      return [];
  }
};
