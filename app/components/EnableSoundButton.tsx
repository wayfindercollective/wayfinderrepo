'use client';

import { useState, useEffect } from 'react';
import { orbitron } from '../fonts';

export default function EnableSoundButton() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [showLoading, setShowLoading] = useState(false);

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

  // Auto-initialize audio on component mount
  useEffect(() => {
    // Check if sound was previously enabled, or enable by default
    const soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled !== 'false') {
      // Try to initialize audio automatically
      initAudio();
    }
  }, []);

  // Listen for audio ended event to redirect
  useEffect(() => {
    const handleAudioEnded = () => {
      if (showLoading) {
        // Scroll to enrollment button
        const enrollButton = document.getElementById('enroll');
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

  const disableAudio = () => {
    // Stop all audio elements on the page
    if (typeof window !== 'undefined') {
      // Find and pause all HTML audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      
      // Also check for any Audio objects created via new Audio()
      // We'll use a custom event to notify components to stop their audio
      window.dispatchEvent(new CustomEvent('audioDisabled'));
    }

    // Close audio context
    if (audioContext) {
      audioContext.close().catch(() => {
        // Context might already be closed
      });
      setAudioContext(null);
    }

    // Remove global references
    if (typeof window !== 'undefined') {
      (window as any).audioContext = null;
      localStorage.setItem('soundEnabled', 'false');
    }
    
    setShowLoading(false);
  };

  const handleClick = async () => {
    if (audioContext) {
      // Audio context already exists - this means "Join the Void" was clicked
      setShowLoading(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('audioEnabled'));
      }
    } else {
      // Enable sound - initAudio will handle resuming if needed
      await initAudio();
      // Dispatch event to trigger audio playback in HeroLogo
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('audioEnabled'));
      }
    }
  };

  // Determine button text based on whether audio context is active
  const buttonText = audioContext ? 'Join the Void 🔊' : 'Enable the Signal 🔊';

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className={`px-6 py-3 bg-black border-2 border-[#00FFFF] rounded text-[#00FFFF] text-lg sm:text-xl font-bold cursor-pointer transition-all duration-300 hover:bg-[#0a0a0a] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] ${audioContext ? 'button-shimmer' : ''} ${orbitron.variable}`}
        style={{ 
          fontFamily: 'var(--font-display), sans-serif', 
          letterSpacing: '0.1em', 
          textTransform: 'uppercase',
          position: 'relative'
        }}
      >
        <span style={{ position: 'relative', zIndex: 2 }}>{buttonText}</span>
      </button>
      
      {showLoading && (
        <div className="mt-4 flex items-center gap-3 text-[#00FFFF] text-sm sm:text-base animate-pulse">
          <div className="w-5 h-5 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Welcome to the movement. You will be redirected shortly.</span>
        </div>
      )}
    </div>
  );
}

