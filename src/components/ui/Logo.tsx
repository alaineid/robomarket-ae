"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "mobile" | "compact";
  href?: string;
  onClick?: () => void;
  className?: string;
  inFooter?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  href = "/",
  onClick,
  className = "",
  inFooter = false,
}) => {
  const renderLogoContent = () => (
    <div className={`flex items-center ${className}`}>
      <span className="text-[#4DA9FF] font-bold text-xl">Robo</span>
      <span
        className={`text-xl font-bold ${inFooter ? "text-white" : "text-gray-800"}`}
      >
        Market
      </span>
      <span className="ml-1 text-xs bg-[#4DA9FF] text-white px-1.5 py-0.5 rounded-md uppercase tracking-tight">
        UAE
      </span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center group"
        aria-label="RoboMarket Home"
        onClick={onClick}
      >
        {renderLogoContent()}
      </Link>
    );
  }

  return renderLogoContent();
};

export default Logo;
