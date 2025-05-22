import React, { JSX, ReactNode } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: ContainerSize;
}

export default function Container({
  children,
  className = "",
  as: Component = "div",
  size = "full",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-screen-sm", // 640px
    md: "max-w-screen-md", // 768px
    lg: "max-w-screen-lg", // 1024px
    xl: "max-w-7xl", // 1280px
    full: "max-w-full", // No max width
  };

  return (
    <Component
      className={`w-full ${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Component>
  );
}
