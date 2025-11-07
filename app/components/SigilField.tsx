'use client';
import { useRef, useEffect } from 'react';
import './starfield.css';

type Sigil = { 
  x: number; 
  y: number; 
  z: number; 
  size: number; 
  vx: number; 
  vy: number; 
  rotation: number; 
  rotSpeed: number;
};

export default function SigilField({ count = 100 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigilsRef = useRef<Sigil[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

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

    // Load the Doctrine_Sigil.png image
    const img = new Image();
    img.src = '/Doctrine_Sigil.png';
    img.onload = () => {
      imageRef.current = img;
      makeSigils();
      if (raf === 0) {
        raf = requestAnimationFrame(step);
      }
    };
    img.onerror = () => {
      console.error('Failed to load Doctrine_Sigil.png');
    };

    const makeSigils = () => {
      if (!imageRef.current) return;
      
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      
      sigilsRef.current = Array.from({ length: count }, () => {
        const z = Math.random() * 0.7 + 0.3;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.15 + 0.05) * z; // Vary speed based on depth
        
        // Stars have radius: (1 * z + 0.5) * 0.5, so range is ~0.4 to ~0.75
        // Making sigils 10x smaller than before - roughly 4-8 pixels wide
        const baseSize = 20;
        const sizeVariation = 20;
        const size = ((baseSize + sizeVariation * z) * 2) / 10; // 10x smaller
        
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          size,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01 // Slow rotation
        };
      });
    };

    const step = () => {
      if (!imageRef.current) {
        raf = requestAnimationFrame(step);
        return;
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      for (const sigil of sigilsRef.current) {
        sigil.x += sigil.vx;
        sigil.y += sigil.vy;
        sigil.rotation += sigil.rotSpeed;

        // wrap edges
        if (sigil.x < -50) sigil.x = w + 50;
        if (sigil.x > w + 50) sigil.x = -50;
        if (sigil.y < -50) sigil.y = h + 50;
        if (sigil.y > h + 50) sigil.y = -50;

        // Draw the sigil image
        ctx.save();
        ctx.translate(sigil.x, sigil.y);
        ctx.rotate(sigil.rotation);
        
        // Calculate dimensions maintaining aspect ratio
        const aspectRatio = imageRef.current.width / imageRef.current.height;
        const width = sigil.size;
        const height = sigil.size / aspectRatio;
        
        ctx.drawImage(
          imageRef.current,
          -width / 2,
          -height / 2,
          width,
          height
        );
        ctx.restore();
      }
      ctx.restore();

      raf = requestAnimationFrame(step);
    };

    resize();
    
    const handleResize = () => {
      resize();
      if (imageRef.current) {
        makeSigils();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfieldCanvas" aria-hidden style={{ zIndex: 0 }} />;
}

