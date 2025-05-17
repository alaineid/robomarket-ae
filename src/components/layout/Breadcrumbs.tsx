"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { FaChevronRight, FaHome } from "react-icons/fa";

export type BreadcrumbItem = {
  label: string;
  path: string;
  isCurrent?: boolean;
  href?: string; // Added for backward compatibility
};

interface BreadcrumbsProps {
  items?: {
    label: string;
    href?: string;
    path?: string;
    active?: boolean;
    isCurrent?: boolean;
  }[];
  className?: string;
  omitRoot?: boolean; // Option to omit the home link
  addJsonLd?: boolean; // Option to add JSON-LD schema markup
}

export default function Breadcrumbs({
  items,
  className = "",
  omitRoot = false,
  addJsonLd = true,
}: BreadcrumbsProps) {
  const pathName = usePathname() || "";
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    // If items are provided, use them directly but normalize the format
    if (items) {
      const normalizedItems = items.map((item) => ({
        label: item.label,
        path: item.path || item.href || "/", // Use path, href, or default to '/'
        isCurrent: item.isCurrent || item.active || false,
      }));
      setBreadcrumbItems(normalizedItems);
      return;
    }

    // Otherwise generate them from the pathname
    setBreadcrumbItems(generateBreadcrumbs(pathName));
  }, [pathName, items]);

  // Skip rendering if only root item in breadcrumbs and omitRoot is true
  if (omitRoot && breadcrumbItems.length <= 1) {
    return null;
  }

  // Start with Home if not omitting root
  const displayItems = omitRoot ? breadcrumbItems.slice(1) : breadcrumbItems;

  // Get the base URL for schema items - safely
  const baseUrl =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "https://robomarket.ae";

  // Generate the JSON-LD schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.path}`,
    })),
  };

  return (
    <>
      {/* Add structured data using Next.js Script component */}
      {addJsonLd && (
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm ${className}`}
      >
        <ol className="flex items-center flex-wrap">
          {displayItems.map((item, index) => (
            <li key={`${item.path}-${index}`} className="flex items-center">
              {/* Add separator between items */}
              {index > 0 && (
                <span className="mx-2 text-gray-400">
                  <FaChevronRight size={10} aria-hidden="true" />
                </span>
              )}

              {/* Display Home icon for root */}
              {index === 0 && item.path === "/" && !omitRoot && (
                <Link
                  href="/"
                  className="text-gray-500 hover:text-[#4DA9FF] transition-colors flex items-center"
                  aria-label="Home"
                >
                  <FaHome className="mr-1" />
                  <span>Home</span>
                </Link>
              )}

              {/* Other items */}
              {(index > 0 || item.path !== "/" || omitRoot) &&
                (item.isCurrent ? (
                  <span
                    className="text-[#4DA9FF] font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.path || "/"} // Ensure href is never undefined
                    className="text-gray-500 hover:text-[#4DA9FF] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs from the pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Always include Home as the first breadcrumb
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", path: "/", isCurrent: pathname === "/" },
  ];

  // Skip if we're on the home page
  if (pathname === "/") {
    return breadcrumbs;
  }

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Special cases for dynamic routes like [id]
  const isProductDetail = segments[0] === "product" && segments.length > 1;

  // Generate breadcrumb items for each segment
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip adding 'product' segment by itself in product detail pages
    if (isProductDetail && segment === "product") {
      breadcrumbs.push({
        label: "Shop",
        path: "/shop",
        isCurrent: false,
      });
      return;
    }

    // Handle product ID segments specially
    if (isProductDetail && index === 1) {
      breadcrumbs.push({
        label: "Product Details",
        path: currentPath,
        isCurrent: true,
      });
      return;
    }

    // Format the label - Use our mapping or convert segment to title case
    const isLastSegment = index === segments.length - 1;
    breadcrumbs.push({
      label: formatBreadcrumbLabel(segment),
      path: currentPath,
      isCurrent: isLastSegment,
    });
  });

  return breadcrumbs;
}

// Helper to format breadcrumb labels nicely
function formatBreadcrumbLabel(segment: string): string {
  // Map of path segments to friendly names
  const pathLabels: Record<string, string> = {
    shop: "Shop",
    product: "Product",
    cart: "Cart",
    checkout: "Checkout",
    about: "About Us",
    support: "Support",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    account: "My Account",
    faq: "FAQ",
    contact: "Contact Us",
  };

  // Return mapped label if exists, otherwise convert to title case
  return (
    pathLabels[segment.toLowerCase()] ||
    segment
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}
