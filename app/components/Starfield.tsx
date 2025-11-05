'use client';
import { useRef, useEffect } from 'react';
import './starfield.css';

type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number };

export default function Starfield({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--cyan-glow')
      .trim() || '#00FFFF';

    const makeStars = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      starsRef.current = Array.from({ length: count }, () => {
        const z = Math.random() * 0.7 + 0.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 2 * z + 1,  // Make stars bigger and more visible
          vx: (Math.random() - 0.5) * 0.2,  // Slow drift
          vy: (Math.random() - 0.5) * 0.2
        };
      });
    };

    const step = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.9;

      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;

        // wrap edges
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      raf = requestAnimationFrame(step);
    };

    resize();
    makeStars();
    
    const handleResize = () => {
      resize();
      makeStars();
    };
    
    window.addEventListener('resize', handleResize);
    raf = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfieldCanvas" aria-hidden />;
}
