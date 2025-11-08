'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Starfield from './Starfield';
import EnableSoundButton from './EnableSoundButton';

export default function HeroLogo() {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [flickerIntensity, setFlickerIntensity] = useState(1);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const audioStartTimeRef = useRef<number | null>(null);
  const smoothedIntensityRef = useRef<number>(1.0);
  const smoothedBrightnessRef = useRef<number>(1.15);

  useEffect(() => {
    // Create audio element for the video file
    // URL encode spaces in filename
    const audioPath = '/reality real story_2025-10-22T10-31-44_1.MP4'.replace(/ /g, '%20');
    const audio = new Audio(audioPath);
    audio.loop = false;
    audio.volume = 1.0;
    
    // Stop flicker animation when audio ends
    audio.addEventListener('ended', () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Reset logo to original state
      if (logoRef.current) {
        const logo = logoRef.current.querySelector('img') as HTMLImageElement;
        if (logo) {
          logo.style.opacity = '1';
          logo.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
          logo.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
        }
      }
      
      setFlickerIntensity(1);
      
      // Dispatch audio ended event for redirect
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('audioEnded'));
      }
    });
    
    setAudioElement(audio);

    return () => {
      // Cleanup
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Analyze audio and update flicker effect
  const analyzeAudio = () => {
    if (!analyserRef.current || !logoRef.current || !audioElement) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate average amplitude for rhythm detection
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    
    // Normalize to 0-1 range and create very intense flicker effect
    // Use a combination of low frequencies (bass) and overall amplitude
    const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3] + dataArray[4]) / 5 / 255;
    const normalized = Math.min(average / 255, 1);
    
    // Calculate time-based intensity multiplier and smoothing
    const currentTime = audioElement.currentTime;
    let timeMultiplier = 1.0;
    let smoothingFactor = 0.95; // Higher = slower changes (0.95 = smooth, 0.1 = very fast)
    let useRawValues = false; // Use raw values directly for instant response
    let baseFlickerIntensity = 0; // Base flickering independent of audio
    
    if (currentTime < 2.0) {
      // First 2 seconds: Exactly 12 flickers
      // Create 12 distinct flicker pulses evenly spaced over 2 seconds
      const flickerCount = 12;
      const flickerInterval = 2.0 / flickerCount; // ~0.167 seconds per flicker
      const flickerIndex = Math.floor(currentTime / flickerInterval);
      const flickerProgress = (currentTime % flickerInterval) / flickerInterval;
      
      // Create a pulse function: quick flash that fades
      // Each flicker is a pulse that peaks quickly and fades
      // Make it sharper and more dramatic
      let pulseValue = 0;
      if (flickerProgress < 0.15) {
        // Very quick rise (first 15% of flicker interval)
        pulseValue = flickerProgress / 0.15; // 0 to 1
      } else if (flickerProgress < 0.3) {
        // Peak hold (15% to 30%)
        pulseValue = 1.0;
      } else {
        // Fade out (30% to 100%)
        pulseValue = Math.max(0, 1.0 - ((flickerProgress - 0.3) / 0.7)); // 1 to 0
      }
      
      // Map pulse to intensity range: 0.1 to 1.0 for very dramatic flickering
      // Make the low point very low and high point very high for clear visibility
      baseFlickerIntensity = 0.1 + pulseValue * 0.9;
      
      timeMultiplier = 4.5 - (currentTime / 2.0) * 2.0; // Start at 4.5, decrease over time
      smoothingFactor = 0.0; // No smoothing for instant, sharp flickering
      useRawValues = true; // Use raw values directly for instant, visible flickering
    } else if (currentTime < 4.0) {
      // Transition period: 2-4 seconds - smoothly fade from base flicker to audio-based flicker
      const transitionProgress = (currentTime - 2.0) / 2.0; // 0 to 1 over 2 seconds
      
      // Gradually blend from base flicker to audio-based flicker
      // Start with more base flicker, end with more audio flicker
      const baseFlickerWeight = 1.0 - transitionProgress; // Start at 1.0, fade to 0
      const audioFlickerWeight = transitionProgress; // Start at 0, fade to 1
      
      // Create a subtle base flicker that fades out during transition
      // Reduce the intensity range during transition to create a fade effect
      const flickerCount = 12;
      const flickerInterval = 2.0 / flickerCount;
      const flickerProgress = ((currentTime - 2.0) % flickerInterval) / flickerInterval;
      let pulseValue = 0;
      if (flickerProgress < 0.15) {
        pulseValue = flickerProgress / 0.15;
      } else if (flickerProgress < 0.3) {
        pulseValue = 1.0;
      } else {
        pulseValue = Math.max(0, 1.0 - ((flickerProgress - 0.3) / 0.7));
      }
      // Reduce base flicker intensity range during transition (fade it out)
      const baseFlickerRange = 0.9 * (1.0 - transitionProgress); // Fade from 0.9 to 0
      baseFlickerIntensity = 0.3 + pulseValue * baseFlickerRange; // Start higher, fade to 0.3
      
      // Gradually increase smoothing during transition
      smoothingFactor = transitionProgress * 0.4; // From 0 to 0.4
      useRawValues = transitionProgress < 0.3; // Switch to smoothed values earlier in transition
      
      // Calculate time multiplier - start lower and decrease more gradually
      const fadeStartTime = 2.0;
      const fadeDuration = 28.0;
      const elapsedAfterStart = currentTime - fadeStartTime;
      const fadeProgress = Math.min(elapsedAfterStart / fadeDuration, 1.0);
      // Start at lower multiplier (around 1.0) and decrease gradually
      timeMultiplier = 1.0 - (fadeProgress * 0.5); // From 1.0 to 0.5
    } else {
      // After 4 seconds: Fully audio-based flickering
      const fadeStartTime = 2.0;
      const fadeDuration = 28.0;
      const elapsedAfterStart = currentTime - fadeStartTime;
      const fadeProgress = Math.min(elapsedAfterStart / fadeDuration, 1.0);
      // Continue gradual fade - start from where transition left off (around 0.5)
      timeMultiplier = 0.5 - (fadeProgress * 0.4); // From 0.5 to 0.1 (very subtle)
      // Gradually increase smoothing (slower flickering) as time progresses
      smoothingFactor = 0.4 + (fadeProgress * 0.55); // From 0.4 (moderate) to 0.95 (slow)
      useRawValues = false;
    }
    
    // Very intense flicker: combine base flicker (for first 2s), bass and overall amplitude
    // For first 2 seconds, baseFlickerIntensity provides guaranteed visible flickering
    // For transition period (2-4s), blend between base and audio flicker
    const audioBasedIntensity = 0.2 + (normalized * 0.5) + (bass * 0.4);
    let combinedIntensity: number;
    
    if (currentTime < 2.0) {
      // First 2 seconds: Dominantly use base flicker
      combinedIntensity = baseFlickerIntensity * 0.9 + audioBasedIntensity * 0.1 * timeMultiplier;
    } else if (currentTime < 4.0) {
      // Transition period: Blend from base flicker to audio flicker
      const transitionProgress = (currentTime - 2.0) / 2.0;
      const baseFlickerWeight = 1.0 - transitionProgress;
      const audioFlickerWeight = transitionProgress;
      combinedIntensity = baseFlickerIntensity * baseFlickerWeight + audioBasedIntensity * audioFlickerWeight * timeMultiplier;
    } else {
      // After 4 seconds: Fully audio-based
      combinedIntensity = audioBasedIntensity * timeMultiplier;
    }
    
    const rawIntensity = Math.max(0.1, Math.min(1.0, combinedIntensity));
    
    // For first 2 seconds, use raw values directly for instant flickering
    // After that, smooth the intensity changes
    let intensity: number;
    if (useRawValues) {
      intensity = rawIntensity;
      smoothedIntensityRef.current = rawIntensity; // Update ref for smooth transition later
    } else {
      smoothedIntensityRef.current = smoothedIntensityRef.current * smoothingFactor + rawIntensity * (1 - smoothingFactor);
      intensity = smoothedIntensityRef.current;
    }
    
    setFlickerIntensity(intensity);

    // Apply visual flicker effect with dramatic contrast changes
    if (logoRef.current) {
      const logo = logoRef.current.querySelector('img') as HTMLImageElement;
      if (logo) {
        // High contrast opacity: ranges from 0.1 to 1.0 (very dramatic fade in/out)
        const opacity = Math.max(0.1, Math.min(1.0, intensity));
        
        // High contrast brightness: ranges from 0.4 to 2.2 (very dramatic)
        // For first 2 seconds, create 12 distinct brightness flickers
        // For transition period (2-4s), blend between base and audio brightness
        let baseBrightness: number;
        if (currentTime < 2.0) {
          // Create 12 distinct brightness flickers matching intensity flickers
          const flickerCount = 12;
          const flickerInterval = 2.0 / flickerCount;
          const flickerIndex = Math.floor(currentTime / flickerInterval);
          const flickerProgress = (currentTime % flickerInterval) / flickerInterval;
          
          // Create matching pulse for brightness - sharper and more dramatic
          let brightnessPulse = 0;
          if (flickerProgress < 0.15) {
            brightnessPulse = flickerProgress / 0.15;
          } else if (flickerProgress < 0.3) {
            brightnessPulse = 1.0;
          } else {
            brightnessPulse = Math.max(0, 1.0 - ((flickerProgress - 0.3) / 0.7));
          }
          
          // More dramatic brightness range: 0.2 to 2.0 for very visible flickering
          const baseBrightnessFlicker = 0.2 + brightnessPulse * 1.8;
          const audioBrightness = 0.4 + (normalized * 0.8) + (bass * 0.6);
          baseBrightness = baseBrightnessFlicker * 0.85 + audioBrightness * 0.15 * timeMultiplier;
    } else if (currentTime < 4.0) {
      // Transition period: Blend from base brightness flicker to audio brightness
      const transitionProgress = (currentTime - 2.0) / 2.0;
      const baseFlickerWeight = 1.0 - transitionProgress;
      const audioFlickerWeight = transitionProgress;
      
      // Create fading base brightness flicker - reduce intensity during transition
      const flickerCount = 12;
      const flickerInterval = 2.0 / flickerCount;
      const flickerProgress = ((currentTime - 2.0) % flickerInterval) / flickerInterval;
      let brightnessPulse = 0;
      if (flickerProgress < 0.15) {
        brightnessPulse = flickerProgress / 0.15;
      } else if (flickerProgress < 0.3) {
        brightnessPulse = 1.0;
      } else {
        brightnessPulse = Math.max(0, 1.0 - ((flickerProgress - 0.3) / 0.7));
      }
      // Reduce brightness flicker range during transition
      const brightnessFlickerRange = 1.8 * (1.0 - transitionProgress); // Fade from 1.8 to 0
      const baseBrightnessFlicker = 0.5 + brightnessPulse * brightnessFlickerRange; // Start at 0.5-2.3, fade to 0.5
      const audioBrightness = 0.4 + (normalized * 0.8) + (bass * 0.6);
      baseBrightness = baseBrightnessFlicker * baseFlickerWeight + audioBrightness * audioFlickerWeight * timeMultiplier;
    } else {
      baseBrightness = 0.4 + (normalized * 0.8) + (bass * 0.6);
    }
        
        const rawBrightness = Math.max(0.3, Math.min(2.2, baseBrightness * (currentTime < 2.0 ? timeMultiplier : 1.0)));
        
        // For first 2 seconds, use raw values directly for instant flickering
        // After that, smooth brightness changes
        let brightness: number;
        if (useRawValues) {
          brightness = rawBrightness;
          smoothedBrightnessRef.current = rawBrightness; // Update ref for smooth transition later
        } else {
          smoothedBrightnessRef.current = smoothedBrightnessRef.current * smoothingFactor + rawBrightness * (1 - smoothingFactor);
          brightness = smoothedBrightnessRef.current;
        }
        
        logo.style.opacity = opacity.toString();
        logo.style.filter = `contrast(1.4) brightness(${brightness}) saturate(1.2)`;
        logo.style.webkitFilter = `contrast(1.4) brightness(${brightness}) saturate(1.2)`;
        
        // Dispatch flicker data for other components (like button)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('flickerData', {
            detail: { intensity, brightness }
          }));
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const handleMouseEnter = () => {
    if (!audioElement) return;

    // Check if audio is enabled
    const soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled === 'false') {
      return; // Don't play audio if disabled
    }

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
            
            // Create analyser node for audio visualization
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.2; // Low smoothing for fast, responsive flickering
            
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            audioSourceRef.current = source;
            analyserRef.current = analyser;
            
            // Start analyzing audio for flicker effect
            analyzeAudio();
          } catch (err) {
            // Source might already exist or connection failed, continue anyway
            console.warn('Could not create media source:', err);
          }
        } else if (analyserRef.current) {
          // If source already exists, start analyzing
          analyzeAudio();
        }
      } catch (err) {
        console.warn('Error with audio context:', err);
      }
    }

    // Reset and play audio
    audioElement.currentTime = 0;
    audioStartTimeRef.current = Date.now();
    
    // Reset smoothed values for fresh start
    smoothedIntensityRef.current = 1.0;
    smoothedBrightnessRef.current = 1.15;
    
    audioElement.play().catch((err) => {
      console.warn('Could not play audio:', err);
    });
  };

  const handleMouseLeave = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    // Stop animation loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    audioStartTimeRef.current = null;
    
    // Reset smoothed values
    smoothedIntensityRef.current = 1.0;
    smoothedBrightnessRef.current = 1.15;
    
    // Reset logo to original state
    if (logoRef.current) {
      const logo = logoRef.current.querySelector('img') as HTMLImageElement;
      if (logo) {
        logo.style.opacity = '1';
        logo.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
        logo.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
      }
    }
    
    setFlickerIntensity(1);
  };

  // Listen for audio disable event
  useEffect(() => {
    const handleAudioDisabled = () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      
      // Disconnect audio source if connected
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.disconnect();
        } catch (e) {
          // Source might already be disconnected
        }
        audioSourceRef.current = null;
      }
      analyserRef.current = null;
      
      // Stop animation loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Reset logo to original state
      if (logoRef.current) {
        const logo = logoRef.current.querySelector('img') as HTMLImageElement;
        if (logo) {
          logo.style.opacity = '1';
          logo.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
          logo.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
        }
      }
      
      setFlickerIntensity(1);
      audioStartTimeRef.current = null;
      smoothedIntensityRef.current = 1.0;
      smoothedBrightnessRef.current = 1.15;
    };

    // Listen for audio enabled event to auto-play
    const handleAudioEnabled = () => {
      if (audioElement) {
        // Check if audio is enabled
        const soundEnabled = localStorage.getItem('soundEnabled');
        if (soundEnabled === 'false') {
          return; // Don't play audio if disabled
        }

        // Stop any currently playing audio and reset
        audioElement.pause();
        audioElement.currentTime = 0;
        
        // Stop any existing animation loop
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

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
                
                // Create analyser node for audio visualization
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.2;
                
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                
                audioSourceRef.current = source;
                analyserRef.current = analyser;
              } catch (err) {
                console.warn('Could not create media source:', err);
              }
            }
            
            // Always restart the analysis loop when restarting audio
            if (analyserRef.current) {
              analyzeAudio();
            }
          } catch (err) {
            console.warn('Error with audio context:', err);
          }
        }

        // Reset and play audio from the beginning
        audioElement.currentTime = 0;
        audioStartTimeRef.current = Date.now();
        
        // Reset smoothed values for fresh start
        smoothedIntensityRef.current = 1.0;
        smoothedBrightnessRef.current = 1.15;
        
        // Reset logo to original state before starting
        if (logoRef.current) {
          const logo = logoRef.current.querySelector('img') as HTMLImageElement;
          if (logo) {
            logo.style.opacity = '1';
            logo.style.filter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
            logo.style.webkitFilter = 'contrast(1.4) brightness(1.15) saturate(1.2)';
          }
        }
        
        // Dispatch audio duration for progress animation
        // If duration is not yet loaded, wait for loadedmetadata event
        const dispatchDuration = () => {
          const duration = audioElement.duration;
          if (duration && isFinite(duration) && duration > 0) {
            window.dispatchEvent(new CustomEvent('audioDuration', { 
              detail: { duration: duration * 1000 } // Convert to milliseconds
            }));
          }
        };
        
        if (audioElement.readyState >= 1) {
          // Metadata already loaded
          dispatchDuration();
        } else {
          // Wait for metadata to load
          audioElement.addEventListener('loadedmetadata', dispatchDuration, { once: true });
        }
        
        audioElement.play().catch((err) => {
          console.warn('Could not play audio:', err);
        });
      }
    };

    window.addEventListener('audioDisabled', handleAudioDisabled);
    window.addEventListener('audioEnabled', handleAudioEnabled);
    
    return () => {
      window.removeEventListener('audioDisabled', handleAudioDisabled);
      window.removeEventListener('audioEnabled', handleAudioEnabled);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  return (
    <section className="relative text-white overflow-visible bg-transparent">
      {/* starfield behind everything */}
      <div className="absolute inset-0 -z-10">
        <Starfield />
      </div>

      {/* logo plus cyan underline */}
      <div 
        ref={logoRef}
        className="relative w-fit mx-auto -mt-4 group z-10" 
        style={{ transform: 'scale(0.75)' }}
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

        {/* Sound button right under the cyan line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[67.5%] z-10">
          <EnableSoundButton />
        </div>
      </div>
    </section>
  );
}
