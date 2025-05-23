"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import Logo from "../ui/Logo";
import MobileNav from "./MobileNav";
import DesktopActions from "./DesktopActions";
import DesktopNav from "./DesktopNav";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-none ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <Container>
        <div className="flex items-center py-4">
          {/* Logo */}
          <Logo className="mr-8" />

          {/* Desktop Navigation */}
          <div className="flex-grow">
            <DesktopNav />
          </div>
          
          {/* Separator */}
          <div className="mx-4 h-8 w-px bg-gray-200"></div>

          <DesktopActions />
        </div>
      </Container>
      <MobileNav />
    </header>
  );
};

export default Header;
