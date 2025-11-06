import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-white p-8
                  ring-1 ring-blue-900/15
                  shadow-[0_12px_40px_-12px_rgba(30,58,138,0.45)]
                  ${className}`}
    >
      {children}
    </div>
  );
}
