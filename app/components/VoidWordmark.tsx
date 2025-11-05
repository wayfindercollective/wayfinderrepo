"use client";

import Image from "next/image";

type Props = { className?: string };

export default function VoidWordmark({ className }: Props) {
  return (
    <div
      className={`relative inline-block ${className || ""}`}
      aria-label="Void Underground"
    >
      {/* Master Logo */}
      <div className="relative">
        <Image
          src="/Master_Logo.jpg"
          alt="Void Underground"
          width={1100}
          height={400}
          className="w-full h-auto"
          style={{
            mixBlendMode: 'multiply',
            filter: 'brightness(1.1) contrast(1.2)',
          }}
          priority
        />
      </div>
    </div>
  );
}
