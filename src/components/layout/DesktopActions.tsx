import React from "react";
import ProfileDropdown from "../ui/ProfileDropdown";
import CartDropdown from "../ui/CartDropdown";
import { FiBell } from "react-icons/fi";

const DesktopActions = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      {/* Profile dropdown */}
      <ProfileDropdown />
      
      {/* Notification bell */}
      <button
        className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group"
        aria-label="Notifications"
      >
        <div className="relative">
          <FiBell className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
        </div>
      </button>

      {/* Cart Dropdown */}
      <CartDropdown />
    </div>
  );
};

export default DesktopActions;
