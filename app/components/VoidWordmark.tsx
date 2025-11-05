"use client";

import { useState, useRef, useEffect } from "react";

type Props = { className?: string };

export default function VoidWordmark({ className }: Props) {
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const updateTextWidth = () => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateTextWidth();
    
    // Handle window resize
    window.addEventListener("resize", updateTextWidth);
    return () => window.removeEventListener("resize", updateTextWidth);
  }, []);

  return (
    <div
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Void Underground"
    >
      {/* Blue line positioned right above the text */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: "-12px",
          height: "3px",
          width: hovered && textWidth > 0 ? `${textWidth}px` : "0px",
          background: "var(--cyan-glow)",
          boxShadow: "0 0 14px var(--cyan-glow)",
          transition: "width 500ms ease",
          transform: "translateX(-50%)",
        }}
      />
      
      {/* Void Underground text */}
      <h1
        ref={textRef}
        className="h1-void text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-orbitron)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 700,
        }}
      >
        Void Underground
      </h1>
    </div>
  );
}
