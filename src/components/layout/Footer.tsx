"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiTwitter, FiInstagram, FiFacebook, FiLinkedin } from "react-icons/fi";
import Container from "./Container";
import Logo from "../ui/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info Column */}
            <div>
              <Logo inFooter={true} />
              <p className="text-gray-400 mb-4">
                Your trusted marketplace for premium humanoid robots and
                accessories.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FiFacebook />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FiTwitter />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FiInstagram />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">
                <p className="mb-2">Dubai, UAE</p>
                <p className="mb-2">+971 58 583 6777</p>
                <p className="mb-2">
                  <a
                    href="mailto:info@robomarket.ae"
                    className="hover:text-white transition-colors duration-300"
                  >
                    info@robomarket.ae
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800 py-6 text-sm text-center text-gray-500">
          <p>© {currentYear} RoboMarket. All rights reserved.</p>
          <div className="mt-2 text-xs flex items-center justify-center">
            Powered by{" "}
            <a
              href="https://algorythm.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1"
            >
              <Image
                src="/images/Algorythm.png"
                alt="Algorythm"
                width={80}
                height={20}
                className="inline-block"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
