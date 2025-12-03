'use client';

import { useState, useEffect, useRef } from 'react';

interface InvestmentCarouselProps {
  children: [React.ReactNode, React.ReactNode];
}

export default function InvestmentCarousel({ children }: InvestmentCarouselProps) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastTimeRef.current = 0;
      return;
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      setRotation((prev) => {
        const maxZ = isMobile ? 50 : 100;
        const card1Z = Math.cos((prev * Math.PI) / 180) * maxZ;
        
        // Calculate how close Annual Pass is to being in the foreground
        // card1Z ranges from -maxZ (behind) to +maxZ (in front)
        // Normalize z-position to 0-1 scale where 1 = fully in front
        const normalizedZ = (card1Z + maxZ) / (2 * maxZ); // 0 to 1
        
        // Slow down rotation smoothly when Annual Pass is transitioning into AND out of view
        // Create symmetric slowdown: slow when entering (left to center) AND when exiting (center to right)
        // This creates a smooth, gradual slowdown both ways
        let rotationSpeed = 0.6; // Normal speed
        
        // Slow down when Annual Pass is visible (entering from left OR exiting to right)
        // Start slowing at 30% visibility, slowest at 100% (center), then speed up as it exits
        if (normalizedZ > 0.3) {
          let progress;
          if (normalizedZ <= 0.5) {
            // Entering from left (30% to 50% visible) - gradually slow down
            progress = (normalizedZ - 0.3) / 0.2; // 0 to 1 as it goes from 30% to 50%
            const slowdownFactor = 1 - (progress * progress * 0.33); // Smooth curve
            rotationSpeed = 0.6 * slowdownFactor;
          } else {
            // In center or exiting to right (50% to 100% visible)
            // Slowest at center (50%), then gradually speed up as it exits
            progress = (normalizedZ - 0.5) / 0.5; // 0 to 1 as it goes from 50% to 100%
            const slowdownFactor = 0.67 + (progress * progress * 0.33); // Speed up smoothly
            rotationSpeed = 0.6 * slowdownFactor;
          }
          // Minimum speed is about 0.2 (3x slower) when fully in front - gives ~2 seconds extra visibility
          rotationSpeed = Math.max(0.2, rotationSpeed);
        }
        
        const newRotation = (prev + rotationSpeed) % 360;
        
        return newRotation;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isMobile]);

  // Calculate positions for both cards in a circular orbit around center
  // Radius determines how far cards move horizontally as they orbit
  // Smaller radius on mobile to keep cards on screen
  const radius = isMobile ? 50 : 100; // Distance from center in pixels (horizontal offset)
  const card1Angle = rotation;
  const card2Angle = rotation + 180; // Opposite side

  // Convert angles to positions (circular motion)
  const card1X = Math.sin((card1Angle * Math.PI) / 180) * radius;
  const card1Z = Math.cos((card1Angle * Math.PI) / 180) * radius;
  const card2X = Math.sin((card2Angle * Math.PI) / 180) * radius;
  const card2Z = Math.cos((card2Angle * Math.PI) / 180) * radius;

  // Keep cards at original size - no scaling
  const card1Scale = 1;
  const card2Scale = 1;
  const maxZ = radius;

  // Calculate opacity based on z-position (closer = more visible, further = fade out)
  // When z is negative (behind), opacity should fade to 0
  // When z is positive (in front), opacity should be 1
  // Normalize z from [-radius, radius] to [0, 1] for opacity, then apply power curve for sharper transition
  const normalizedZ1 = (card1Z + maxZ) / (2 * maxZ); // 0 to 1
  const normalizedZ2 = (card2Z + maxZ) / (2 * maxZ); // 0 to 1
  // Use power curve to make transition sharper - cards fade out quickly when going to background
  const card1Opacity = Math.pow(Math.max(0, Math.min(1, normalizedZ1)), 2.5);
  const card2Opacity = Math.pow(Math.max(0, Math.min(1, normalizedZ2)), 2.5);

  // Calculate z-index (closer = higher z-index)
  const card1ZIndex = card1Z > card2Z ? 10 : 5;
  const card2ZIndex = card2Z > card1Z ? 10 : 5;

  return (
    <div 
      className="investment-carousel-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '900px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        perspective: '1200px',
        perspectiveOrigin: 'center center',
        overflow: 'visible',
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          minHeight: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card 1 */}
        <div
          className="investment-carousel-card"
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            transform: `translateX(calc(-50% + ${card1X}px)) translateZ(${card1Z}px)`,
            transformStyle: 'preserve-3d',
            transition: isPaused ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
            opacity: card1Opacity,
            zIndex: card1ZIndex,
            width: '100%',
            maxWidth: '500px',
            willChange: 'transform, opacity',
            pointerEvents: card1Opacity > 0.1 ? 'auto' : 'none',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {children[0]}
        </div>

        {/* Card 2 */}
        <div
          className="investment-carousel-card"
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            transform: `translateX(calc(-50% + ${card2X}px)) translateZ(${card2Z}px)`,
            transformStyle: 'preserve-3d',
            transition: isPaused ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
            opacity: card2Opacity,
            zIndex: card2ZIndex,
            width: '100%',
            maxWidth: '500px',
            willChange: 'transform, opacity',
            pointerEvents: card2Opacity > 0.1 ? 'auto' : 'none',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {children[1]}
        </div>
      </div>

      <style jsx>{`
        .investment-carousel-container {
          overflow: visible !important;
        }
        
        .investment-carousel-card {
          pointer-events: auto;
        }
        
        @media (max-width: 768px) {
          .investment-carousel-container {
            min-height: 650px;
            padding-top: 1.5rem;
            padding-bottom: 2rem;
          }
          
          .investment-carousel-card {
            max-width: 100% !important;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

