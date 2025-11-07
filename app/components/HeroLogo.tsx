'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Starfield from './Starfield';

export default function HeroLogo() {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    // Create audio element for the video file
    // URL encode spaces in filename
    const audioPath = '/reality real story_2025-10-22T10-31-44_1.MP4'.replace(/ /g, '%20');
    const audio = new Audio(audioPath);
    audio.loop = false;
    audio.volume = 0.5;
    setAudioElement(audio);

    return () => {
      // Cleanup
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!audioElement) return;

    const audioCtx = (window as any).audioContext;
    
    // If Web Audio API is enabled, connect the audio element to it
    if (audioCtx) {
      try {
        // Resume audio context if suspended
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        // Connect audio element to Web Audio API context if not already connected
        // Note: createMediaElementSource can only be called once per audio element
        if (!audioSourceRef.current) {
          try {
            const source = audioCtx.createMediaElementSource(audioElement);
            source.connect(audioCtx.destination);
            audioSourceRef.current = source;
          } catch (err) {
            // Source might already exist or connection failed, continue anyway
            console.warn('Could not create media source:', err);
          }
        }
      } catch (err) {
        console.warn('Error with audio context:', err);
      }
    }

    // Reset and play audio
    audioElement.currentTime = 0;
    audioElement.play().catch((err) => {
      console.warn('Could not play audio:', err);
    });
  };

  const handleMouseLeave = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  return (
    <section className="relative text-white overflow-visible bg-transparent">
      {/* starfield behind everything */}
      <div className="absolute inset-0 -z-10">
        <Starfield />
      </div>

      {/* logo plus cyan underline */}
      <div 
        className="relative w-fit mx-auto -mt-4 group z-10" 
        style={{ transform: 'scale(0.75)' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src="/Master_Logo.png?v=2"
          alt="Void Underground"
          width={1800}
          height={400}
          priority
          unoptimized
          className="block select-none pointer-events-none"
          style={{
            filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
          }}
        />

        {/* cyan line tucked under UNDERGROUND */}
        <span
          aria-hidden
          className="
            absolute left-1/2 -translate-x-1/2
            block w-0 h-[6px] rounded-full
            bg-[#0FF]
            shadow-[0_0_10px_#0FF,0_0_24px_rgba(0,255,255,0.5)]
            transition-[width] duration-400 ease-out
            group-hover:w-[86%]
            z-10
          "
          style={{ top: '60%' }}   // nudge this 58 to 62 until it kisses the word
        />
      </div>
    </section>
  );
}
