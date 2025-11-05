'use client';
import { useRef, useEffect } from 'react';
import './starfield.css';

type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number; rotation: number; rotSpeed: number };

export default function Starfield({ count = 150 }: { count?: number }) {
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
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--cyan-glow')
      .trim() || '#00FFFF';

    // Function to draw a star shape
    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const spikes = 5;
      const outerRadius = r;
      const innerRadius = r * 0.4;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const makeStars = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      starsRef.current = Array.from({ length: count }, () => {
        const z = Math.random() * 0.7 + 0.3;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.15 + 0.05) * z; // Vary speed based on depth
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (1 * z + 0.5) * 0.5,  // Half the size
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02 // Slow rotation
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
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.9;

      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        // wrap edges
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;

        drawStar(ctx, s.x, s.y, s.r, s.rotation);
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
    
    // Use ResizeObserver to watch parent element size
    const resizeObserver = new ResizeObserver(() => {
      resize();
      makeStars();
    });
    
    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }
    
    window.addEventListener('resize', handleResize);
    raf = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfieldCanvas" aria-hidden />;
}
