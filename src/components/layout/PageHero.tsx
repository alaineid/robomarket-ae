"use client";

import React, { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Container from "./Container";

interface PageHeroProps {
  title: string | ReactNode;
  description: string;
  breadcrumbItems: {
    label: string;
    href?: string;
    active?: boolean;
  }[];
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  breadcrumbItems,
  children,
}: PageHeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 mb-6 border-b border-gray-100">
      <Container>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-600 max-w-xl">{description}</p>
          </div>

          {/* Optional content slot on the right side */}
          {children}
        </div>
      </Container>
    </div>
  );
}
