'use client';
import { useRef, useEffect } from 'react';
import './starfield.css';

type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number };

export default function Starfield({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, has: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
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
        const z = Math.random() * 0.7 + 0.3;           // depth
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 1 * z + 0.3,
          vx: (Math.random() - 0.5) * 0.05,            // slow drift
          vy: (Math.random() - 0.5) * 0.05
        };
      });
    };

    const step = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // slight parallax toward the mouse
      const mx = mouseRef.current.has ? (mouseRef.current.x - w / 2) / w : 0;
      const my = mouseRef.current.has ? (mouseRef.current.y - h / 2) / h : 0;

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      for (const s of starsRef.current) {
        s.x += s.vx + mx * 0.15 * s.z;
        s.y += s.vy + my * 0.15 * s.z;

        // wrap edges
        if (s.x < -5) s.x = w + 5;
        if (s.x > w + 5) s.x = -5;
        if (s.y < -5) s.y = h + 5;
        if (s.y > h + 5) s.y = -5;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, has: true };
    };
    const onLeave = () => {
      mouseRef.current.has = false;
    };

    resize();
    makeStars();
    window.addEventListener('resize', () => {
      resize();
      makeStars();
    });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfieldCanvas" aria-hidden />;
}
