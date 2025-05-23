"use client";

import React from "react";
import Container from "./Container";

interface PolicyLayoutProps {
  children: React.ReactNode;
}

export default function PolicyLayout({ children }: PolicyLayoutProps) {
  return (
    <Container>
      <div className="py-12">
        <div className="prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 shadow-xl rounded-xl bg-white p-8">
          {children}
        </div>
      </div>
    </Container>
  );
}
