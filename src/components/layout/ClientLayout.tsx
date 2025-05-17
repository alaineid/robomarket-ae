"use client";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="app-wrapper">{children}</div>;
}
