"use client";

import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Any client-side functionality you need
  useEffect(() => {
    // Client-side effects
  }, []);

  return (
    <div className="app-wrapper">
      {children}
    </div>
  );
}
