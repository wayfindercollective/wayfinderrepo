'use client';

import { useState, useEffect } from 'react';
import { orbitron } from '../fonts';

export default function EnableSoundButton() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

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
  };

  const handleClick = async () => {
    if (audioContext) {
      // Disable sound
      disableAudio();
    } else {
      // Enable sound - initAudio will handle resuming if needed
      await initAudio();
    }
  };

  // Determine button text based on whether audio context is active
  const buttonText = audioContext ? 'Release the Signal 🔊' : 'Enter the Signal 🔊';

  return (
    <button
      onClick={handleClick}
      className={`absolute right-5 px-4 py-2 bg-black border-2 border-black rounded text-[#00FFFF] text-xs font-bold cursor-pointer z-[9999] transition-all duration-300 hover:bg-[#0a0a0a] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] ${orbitron.variable}`}
      style={{ 
        fontFamily: 'var(--font-display), sans-serif', 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase',
        position: 'absolute',
        top: '5rem',
        right: '1.25rem'
      }}
    >
      {buttonText}
    </button>
  );
}

