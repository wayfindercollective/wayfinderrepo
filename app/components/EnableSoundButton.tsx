'use client';

import { useState, useEffect, useRef } from 'react';
import { exo2 } from '../fonts';

export default function EnableSoundButton() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const initAudio = async () => {
    // Create AudioContext
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Try to resume audio context if suspended (handles autoplay policies)
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (error) {
        // Browser may require user interaction - that's okay, context is still created
        console.log('Audio context suspended, will need user interaction');
      }
    }
    
    setAudioContext(ctx);
    
    // Expose audioContext globally so you can use it to play sounds
    if (typeof window !== 'undefined') {
      (window as any).audioContext = ctx;
      localStorage.setItem('soundEnabled', 'true');
    }
  };

  // Listen for flicker data from HeroLogo to apply to button and loading message
  useEffect(() => {
    const handleFlickerData = (event: any) => {
      if (isFlickering && event.detail) {
        const { intensity, brightness } = event.detail;
        const opacity = Math.max(0.1, Math.min(1.0, intensity));
        // Use the same filter as the logo: contrast(1.4) brightness() saturate(1.2)
        const filterValue = `contrast(1.4) brightness(${brightness}) saturate(1.2)`;
        
        // Apply to button
        if (buttonRef.current) {
          buttonRef.current.style.opacity = opacity.toString();
          buttonRef.current.style.filter = filterValue;
          buttonRef.current.style.webkitFilter = filterValue;
        }
        
        // Apply to loading message
        if (loadingRef.current) {
          loadingRef.current.style.opacity = opacity.toString();
          loadingRef.current.style.filter = filterValue;
          loadingRef.current.style.webkitFilter = filterValue;
        }
      }
    };

    window.addEventListener('flickerData', handleFlickerData as EventListener);
    
    return () => {
      window.removeEventListener('flickerData', handleFlickerData as EventListener);
    };
  }, [isFlickering]);

  // Listen for audio enabled to start flickering
  useEffect(() => {
    const handleAudioEnabled = () => {
      setIsFlickering(true);
    };

    window.addEventListener('audioEnabled', handleAudioEnabled);
    
    return () => {
      window.removeEventListener('audioEnabled', handleAudioEnabled);
    };
  }, []);

  // Listen for audio ended event to redirect and stop flickering
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsFlickering(false);
      
      // Reset button and loading styles to match logo's initial state
      if (buttonRef.current) {
        buttonRef.current.style.opacity = '1';
        buttonRef.current.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
        buttonRef.current.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
      }
      
      if (loadingRef.current) {
        loadingRef.current.style.opacity = '1';
        loadingRef.current.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
        loadingRef.current.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
      }
      
      if (showLoading) {
        // Scroll to upper enrollment button in Pricing section
        const enrollButton = document.getElementById('pricing-enroll');
        if (enrollButton) {
          enrollButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setShowLoading(false);
        }
      }
    };

    // Listen for custom audio ended event
    window.addEventListener('audioEnded', handleAudioEnded);
    
    return () => {
      window.removeEventListener('audioEnded', handleAudioEnded);
    };
  }, [showLoading]);

  const handleClick = async () => {
    // Always initialize audio and play when Join the Void is clicked
    if (!audioContext) {
      await initAudio();
    }
    
    setShowLoading(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('audioEnabled'));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        id="heroCta"
        ref={buttonRef}
        onClick={handleClick}
        className={`px-6 py-3 bg-black border-2 border-white rounded text-[#00FFFF] text-xl sm:text-2xl md:text-3xl font-bold cursor-pointer hover:bg-[#0a0a0a] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] button-shimmer ${exo2.variable} md:mt-[45px]`}
        style={{ 
          fontFamily: 'var(--fontB-display), sans-serif', 
          letterSpacing: '0.1em', 
          textTransform: 'uppercase',
          fontWeight: 700,
          position: 'relative',
          opacity: 1,
          filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
          WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
          transition: 'none' // Remove transition to allow instant flicker
        }}
      >
        <span style={{ position: 'relative', zIndex: 2 }}>Join the Void</span>
      </button>
      
      {showLoading && (
        <div 
          ref={loadingRef}
          className="mt-4 flex items-center gap-3 text-[#00FFFF] text-sm sm:text-base"
          style={{
            opacity: 1,
            filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            transition: 'none' // Remove transition to allow instant flicker
          }}
        >
          <div className="w-5 h-5 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Welcome to the movement. You will be redirected shortly.</span>
        </div>
      )}
    </div>
  );
}

