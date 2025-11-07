'use client';

import { useState } from 'react';

export default function EnableSoundButton() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initAudio = () => {
    // Create AudioContext (required user gesture)
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Resume audio context if suspended (handles autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    setAudioContext(ctx);
    
    // Expose audioContext globally so you can use it to play sounds
    if (typeof window !== 'undefined') {
      (window as any).audioContext = ctx;
      localStorage.setItem('soundEnabled', 'true');
    }
  };

  const disableAudio = () => {
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

  const handleClick = () => {
    if (audioContext) {
      // Disable sound
      disableAudio();
    } else {
      // Enable sound
      initAudio();
    }
  };

  // Determine button text based on whether audio context is active
  const buttonText = audioContext ? 'Disable sound' : 'Enable sound';

  return (
    <button
      onClick={handleClick}
      className="fixed top-5 right-5 px-4 py-2 bg-[rgba(0,255,255,0.2)] border-2 border-[#00FFFF] rounded text-[#00FFFF] text-xs font-bold cursor-pointer z-[1000] transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:bg-[rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
    >
      {buttonText}
    </button>
  );
}

