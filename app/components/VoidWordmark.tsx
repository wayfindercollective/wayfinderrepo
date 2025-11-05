"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { width?: number; height?: number; className?: string };

export default function VoidWordmark({ width = 1800, height = 400, className }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Void Underground"
    >
      <Image
        src="/logoVoid.jpg"
        alt="Void Underground"
        width={width}
        height={height}
        priority
        style={{ height: "auto", width: "100%" }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          height: "3px",
          width: hovered ? "62%" : "0%",
          background: "var(--cyan-glow)",
          boxShadow: "0 0 14px var(--cyan-glow)",
          transition: "width 500ms ease",
        }}
      />
    </div>
  );
}
