'use client';
import { useRef, useEffect } from 'react';
import './starfield.css';

type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number; rotation: number; rotSpeed: number; color: string };

export default function Starfield({ count = 75 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const flareRef = useRef<{ x: number; y: number; progress: number; active: boolean; startTime: number }>({ x: 0, y: 0, progress: 0, active: false, startTime: 0 });
  const lastFlareTimeRef = useRef<number>(Date.now());

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

    const cyanColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--cyan-glow')
      .trim() || '#00FFFF';
    const magentaColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--magenta')
      .trim() || '#FF00FF';

    // Function to draw a star shape
    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rotation: number, starColor: string) => {
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
      // Ensure we're filling, not stroking
      ctx.fillStyle = starColor;
      ctx.fill();
      ctx.restore();
    };

    const makeStars = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      starsRef.current = Array.from({ length: count }, (_, i) => {
        const z = Math.random() * 0.7 + 0.3;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.15 + 0.05) * z; // Vary speed based on depth
        
        // Gradient density: more stars near top (mandala apex), fewer toward bottom
        // Use exponential distribution biased toward top
        const topBias = Math.pow(Math.random(), 2); // Square to bias toward 0 (top)
        const y = topBias * h;
        
        // 1-2% magenta points, rest cyan
        const isMagenta = Math.random() < 0.015; // 1.5% chance
        const starColor = isMagenta ? magentaColor : cyanColor;
        
        return {
          x: Math.random() * w,
          y,
          z,
          r: (1 * z + 0.5) * 0.5,  // Half the size
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02, // Slow rotation
          color: starColor
        };
      });
    };

    let lastFrameTime = 0;
    const targetFPS = 30; // Reduce to 30 FPS for better performance
    const frameInterval = 1000 / targetFPS;

    const step = (currentTime: number = Date.now()) => {
      // Throttle to 30 FPS for better performance
      if (currentTime - lastFrameTime < frameInterval) {
        raf = requestAnimationFrame(() => step(Date.now()));
        return;
      }
      lastFrameTime = currentTime;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      
      // Reset transform before clearing to ensure we clear the entire canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reapply the device pixel ratio transform
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Check if it's time for a new signal pulse (every 30 seconds)
      if (!flareRef.current.active && currentTime - lastFlareTimeRef.current >= 30000) {
        lastFlareTimeRef.current = currentTime;
        flareRef.current = {
          x: -50, // Start off-screen top-left
          y: -50,
          progress: 0,
          active: true,
          startTime: currentTime
        };
      }

      // Update and draw signal pulse flare
      if (flareRef.current.active) {
        const flare = flareRef.current;
        const duration = 2000; // 2 seconds to cross screen
        const elapsed = currentTime - flare.startTime;
        flare.progress = Math.min(elapsed / duration, 1);
        
        // Diagonal path from top-left to bottom-right
        flare.x = -50 + (w + 100) * flare.progress;
        flare.y = -50 + (h + 100) * flare.progress;
        
        // Draw faint cyan flare with trail
        ctx.save();
        ctx.strokeStyle = cyanColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3 * (1 - flare.progress); // Fade out as it progresses
        ctx.shadowColor = cyanColor;
        ctx.shadowBlur = 15;
        
        // Draw trail
        const trailLength = 100;
        ctx.beginPath();
        ctx.moveTo(flare.x - trailLength * Math.cos(Math.PI / 4), flare.y - trailLength * Math.sin(Math.PI / 4));
        ctx.lineTo(flare.x, flare.y);
        ctx.stroke();
        
        // Draw flare point
        ctx.globalAlpha = 0.5 * (1 - flare.progress);
        ctx.beginPath();
        ctx.arc(flare.x, flare.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = cyanColor;
        ctx.fill();
        
        ctx.restore();
        
        if (flare.progress >= 1) {
          flare.active = false;
        }
      }

      ctx.save();
      ctx.shadowBlur = 6; // Reduce shadow blur for better performance
      ctx.globalAlpha = 0.9;

      // Batch updates for better performance
      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        // wrap edges
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;
      }

      // Draw all stars in one batch
      for (const s of starsRef.current) {
        ctx.shadowColor = s.color;
        drawStar(ctx, s.x, s.y, s.r, s.rotation, s.color);
      }
      ctx.restore();

      raf = requestAnimationFrame(() => step(Date.now()));
    };

    resize();
    makeStars();
    
    const handleResize = () => {
      resize();
      makeStars();
    };
    
    window.addEventListener('resize', handleResize);
    raf = requestAnimationFrame(() => step(Date.now()));
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfieldCanvas" aria-hidden />;
}
