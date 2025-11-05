"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Props = { className?: string };

export default function VoidWordmark({ className }: Props) {
  const [hovered, setHovered] = useState(false);
  const undergroundRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [undergroundWidth, setUndergroundWidth] = useState(0);
  const [undergroundLeft, setUndergroundLeft] = useState(0);

  const updateDimensions = () => {
    if (undergroundRef.current && containerRef.current) {
      const rect = undergroundRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setUndergroundWidth(rect.width);
      setUndergroundLeft(rect.left - containerRect.left);
    }
  };

  useEffect(() => {
    updateDimensions();
    
    // Handle window resize and font loading
    window.addEventListener("resize", updateDimensions);
    const timeout = setTimeout(updateDimensions, 100); // Wait for fonts to load
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Void Underground"
    >
      {/* Master Logo with transparent background */}
      <div className="relative mb-4">
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
      
      {/* UNDERGROUND text with cyan line effect */}
      <div className="relative">
        <span
          ref={undergroundRef}
          className="h1-void text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight block text-center"
          style={{
            fontFamily: "var(--font-orbitron)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 700,
          }}
        >
          UNDERGROUND
        </span>
        
        {/* Cyan line positioned under "UNDERGROUND" */}
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "100%",
            left: `${undergroundLeft + undergroundWidth / 2}px`,
            height: "3px",
            width: hovered && undergroundWidth > 0 ? `${undergroundWidth}px` : "0px",
            background: "var(--cyan-glow)",
            boxShadow: "0 0 14px var(--cyan-glow)",
            transition: "width 500ms ease",
            transform: "translateX(-50%)",
            marginTop: "8px",
          }}
        />
      </div>
    </div>
  );
}
