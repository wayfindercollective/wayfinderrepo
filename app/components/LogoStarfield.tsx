'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import './starfield.css';

type Logo = { 
  x: number; 
  y: number; 
  z: number; 
  size: number; 
  vx: number; 
  vy: number; 
  rotation: number; 
  rotSpeed: number;
  opacity: number;
};

export default function LogoStarfield({ count = 40 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logosRef = useRef<Logo[]>([]);
  const logoElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    const makeLogos = () => {
      const w = window.innerWidth || 1920;
      const h = window.innerHeight || 1080;
      const newLogos = Array.from({ length: count }, () => {
        const z = Math.random() * 0.7 + 0.3;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.15 + 0.05) * z; // Same speed calculation as stars
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          size: (60 * z + 30) * 0.5, // Size based on depth, similar to stars
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02, // Same rotation speed as stars
          opacity: 1.0 // Twice as visible as stars (stars are 0.9, so 1.0 is ~2x)
        };
      });
      logosRef.current = newLogos;
      setLogos(newLogos);
    };

    const step = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let i = 0; i < logosRef.current.length; i++) {
        const logo = logosRef.current[i];
        const element = logoElementsRef.current.get(i);
        
        if (!element) continue;

        // Update position
        logo.x += logo.vx;
        logo.y += logo.vy;
        logo.rotation += logo.rotSpeed;

        // Wrap edges (same logic as stars)
        if (logo.x < -100) logo.x = w + 100;
        if (logo.x > w + 100) logo.x = -100;
        if (logo.y < -100) logo.y = h + 100;
        if (logo.y > h + 100) logo.y = -100;

        // Update DOM element
        element.style.left = `${logo.x}px`;
        element.style.top = `${logo.y}px`;
        element.style.transform = `translate(-50%, -50%) rotate(${logo.rotation}rad) scale(${logo.z})`;
        element.style.opacity = `${logo.opacity}`;
        element.style.width = `${logo.size}px`;
        element.style.height = 'auto';
      }

      raf = requestAnimationFrame(step);
    };

    makeLogos();
    
    const handleResize = () => {
      makeLogos();
    };
    
    window.addEventListener('resize', handleResize);
    raf = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <div ref={containerRef} className="logoStarfieldContainer" aria-hidden>
      {logos.map((logo, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) logoElementsRef.current.set(i, el);
          }}
          className="logoStarfieldItem"
          style={{
            position: 'absolute',
            left: `${logo.x}px`,
            top: `${logo.y}px`,
            transform: `translate(-50%, -50%) rotate(${logo.rotation}rad) scale(${logo.z})`,
            opacity: logo.opacity,
            width: `${logo.size}px`,
            height: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Image
            src="/Master_Logo.jpg"
            alt=""
            width={1800}
            height={400}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
      ))}
    </div>
  );
}
