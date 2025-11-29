'use client';

import { useState, useEffect, useRef } from 'react';

// Extend Window interface for custom properties
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    audioContext?: AudioContext;
  }
}

interface FlickerDataEvent extends CustomEvent {
  detail: {
    intensity: number;
    brightness: number;
  };
}

export default function EnableSoundButton() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [welcomeTextDisplay, setWelcomeTextDisplay] = useState('');
  const [welcomeTextRevealed, setWelcomeTextRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLSpanElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const welcomeTextFull = "Welcome to the movement. You will be redirected shortly.";

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initAudio = async () => {
    // Create AudioContext
    const ctx = new (window.AudioContext || window.webkitAudioContext || AudioContext)();
    
    // Try to resume audio context if suspended (handles autoplay policies)
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Browser may require user interaction - that's okay, context is still created
        console.log('Audio context suspended, will need user interaction');
      }
    }
    
    setAudioContext(ctx);
    
    // Expose audioContext globally so you can use it to play sounds
    if (typeof window !== 'undefined') {
      window.audioContext = ctx;
      localStorage.setItem('soundEnabled', 'true');
    }
  };

  // Listen for flicker data from HeroLogo to apply to button and loading message
  useEffect(() => {
    const handleFlickerData = (event: Event) => {
      const flickerEvent = event as FlickerDataEvent;
      if (isFlickering && flickerEvent.detail) {
        const { intensity, brightness } = flickerEvent.detail;
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

  // Listen for audio duration
  useEffect(() => {
    const handleAudioDuration = (event: Event) => {
      const customEvent = event as CustomEvent<{ duration: number }>;
      if (customEvent.detail && customEvent.detail.duration) {
        setAudioDuration(customEvent.detail.duration);
      }
    };

    window.addEventListener('audioDuration', handleAudioDuration as EventListener);
    
    return () => {
      window.removeEventListener('audioDuration', handleAudioDuration as EventListener);
    };
  }, []);

  // Reserve space for welcome text on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && welcomeTextRef.current) {
      // Wait for next frame to ensure styles are applied
      requestAnimationFrame(() => {
        if (welcomeTextRef.current) {
          // Create a temporary element to measure the full text width
          const tempElement = document.createElement('span');
          tempElement.textContent = welcomeTextFull;
          tempElement.style.visibility = 'hidden';
          tempElement.style.position = 'absolute';
          tempElement.style.whiteSpace = 'nowrap';
          
          // Copy computed styles from the actual element
          const computedStyle = window.getComputedStyle(welcomeTextRef.current);
          tempElement.style.fontSize = computedStyle.fontSize;
          tempElement.style.fontFamily = computedStyle.fontFamily;
          tempElement.style.fontWeight = computedStyle.fontWeight;
          tempElement.style.letterSpacing = computedStyle.letterSpacing;
          tempElement.style.fontStyle = computedStyle.fontStyle;
          
          document.body.appendChild(tempElement);
          const width = tempElement.offsetWidth;
          document.body.removeChild(tempElement);
          
          // Set the width to reserve space on the parent
          if (welcomeTextRef.current.parentElement) {
            welcomeTextRef.current.parentElement.style.minWidth = `${width}px`;
          }
        }
      });
    }
  }, [welcomeTextFull]);

  // Typewriter effect when loading starts
  useEffect(() => {
    if (!showLoading) {
      // Reset when loading is hidden
      setWelcomeTextDisplay('');
      setWelcomeTextRevealed(false);
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show full text instantly
      setWelcomeTextDisplay(welcomeTextFull);
      setWelcomeTextRevealed(true);
    } else {
      // Start typewriter animation - 0.75 seconds total
      const totalDuration = 750; // 0.75 seconds
      const characterCount = welcomeTextFull.length;
      // Calculate interval so last character appears at exactly 0.75 seconds
      // First character at 0ms, last at 750ms, so interval = 750 / (N-1)
      const interval = characterCount > 1 ? totalDuration / (characterCount - 1) : totalDuration;
      let currentIndex = 0;

      // Show first character immediately
      setWelcomeTextDisplay(welcomeTextFull.substring(0, 1));
      currentIndex = 1;

      const typeInterval = setInterval(() => {
        if (currentIndex < characterCount) {
          setWelcomeTextDisplay(welcomeTextFull.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setWelcomeTextRevealed(true);
          typewriterIntervalRef.current = null;
        }
      }, interval);

      typewriterIntervalRef.current = typeInterval;
    }

    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
    };
  }, [showLoading, welcomeTextFull]);

  // Start progress animation when loading shows and duration is available
  useEffect(() => {
    if (!showLoading) {
      // Reset progress when loading is hidden
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    // Start progress animation with 0.75 seconds duration
    setProgress(0);
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Use 0.75 seconds (750ms) for the progress animation
    const duration = 750;
    const steps = 100;
    const stepDuration = duration / steps;
    let currentProgress = 0;
    
    progressIntervalRef.current = setInterval(() => {
      currentProgress += 1;
      if (currentProgress >= 100) {
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        setProgress(currentProgress);
      }
    }, stepDuration);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [showLoading]);

  // Redirect after 0.75 seconds when loading starts
  useEffect(() => {
    if (!showLoading) {
      return;
    }

    // Set up scroll to Buy Now button after 0.75 seconds
    const redirectTimeout = setTimeout(() => {
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
      
      // Check if desktop (md breakpoint is typically 768px)
      const isDesktop = window.innerWidth >= 768;
      
      if (isDesktop) {
        // On desktop: Scroll to center both "What You Get" section and Pricing section
        const whatYouGetSection = document.getElementById('what-you-get');
        const pricingSection = document.getElementById('pricing-section');
        
        if (whatYouGetSection && pricingSection) {
          // Get timer height to account for it (now it's just a corner element, minimal impact)
          const timerContainer = document.getElementById('timer-container');
          const timerHeight = timerContainer ? Math.max(0, timerContainer.offsetHeight - 20) : 0; // Small buffer since it's in corner
          
          // Get positions and heights of both sections
          const whatYouGetRect = whatYouGetSection.getBoundingClientRect();
          const pricingRect = pricingSection.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          const whatYouGetTop = whatYouGetRect.top + scrollTop;
          const whatYouGetHeight = whatYouGetRect.height;
          const pricingTop = pricingRect.top + scrollTop;
          const pricingHeight = pricingRect.height;
          
          // Calculate the midpoint between the start of "What You Get" and the end of Pricing section
          const combinedStart = whatYouGetTop;
          const combinedEnd = pricingTop + pricingHeight;
          const combinedHeight = combinedEnd - combinedStart;
          
          // Calculate center point of both sections
          const combinedCenter = combinedStart + (combinedHeight / 2);
          
          // Get viewport height (excluding timer)
          const windowHeight = window.innerHeight;
          const visibleHeight = windowHeight - timerHeight;
          
          // Scroll to center the combined sections in the viewport
          const scrollPosition = combinedCenter - (visibleHeight / 2);
          
          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        } else {
          // Fallback: scroll to Buy Now button if sections not found
          const enrollButton = document.getElementById('pricing-enroll');
          if (enrollButton) {
            const timerContainer = document.getElementById('timer-container');
            const timerHeight = timerContainer ? timerContainer.offsetHeight : 0;
            const rect = enrollButton.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            const visibleHeight = windowHeight - timerHeight;
            const offset = elementTop - (visibleHeight / 2) + (elementHeight / 2) - timerHeight;
            
            window.scrollTo({
              top: offset,
              behavior: 'smooth'
            });
          }
        }
      } else {
        // On mobile: Scroll to the Buy Now button (original behavior)
        const enrollButton = document.getElementById('pricing-enroll');
        if (enrollButton) {
          // Get timer height to account for it in centering calculation
          const timerContainer = document.getElementById('timer-container');
          const timerHeight = timerContainer ? timerContainer.offsetHeight : 0;
          
          // Calculate the position to center the button in the viewport (excluding timer)
          const rect = enrollButton.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          const elementHeight = rect.height;
          const windowHeight = window.innerHeight;
          const visibleHeight = windowHeight - timerHeight; // Subtract timer height
          const offset = elementTop - (visibleHeight / 2) + (elementHeight / 2) - timerHeight;
          
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        }
      }
      
      setShowLoading(false);
    }, 750);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [showLoading]);

  // Single debounce ref for both touch and click events
  const lastTriggerTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  
  const handleClick = async () => {
    const now = Date.now();
    
    // Prevent multiple simultaneous executions
    if (isProcessingRef.current) {
      return;
    }
    
    // Debounce: if event happened within 300ms of last trigger, ignore it
    // This prevents rapid double-taps but allows legitimate single taps
    // Only check if we've actually triggered before (lastTriggerTimeRef > 0)
    if (lastTriggerTimeRef.current > 0 && now - lastTriggerTimeRef.current < 300) {
      return;
    }
    
    isProcessingRef.current = true;
    lastTriggerTimeRef.current = now;
    
    // Reset typewriter effect every time button is clicked
    setWelcomeTextDisplay('');
    setWelcomeTextRevealed(false);
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
      typewriterIntervalRef.current = null;
    }
    
    // Reset loading spinner/progress every time button is clicked
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Always initialize audio and play when Join the Void is clicked
    if (!audioContext) {
      await initAudio();
    }
    
    // Temporarily set showLoading to false to force useEffect to restart
    setShowLoading(false);
    
    // Use setTimeout to ensure state update completes before setting to true
    setTimeout(() => {
      setShowLoading(true);
      
      // Start progress animation immediately - 0.75 seconds duration
      const duration = 750;
      const steps = 100;
      const stepDuration = duration / steps;
      let currentProgress = 0;
      
      setProgress(0);
      
      progressIntervalRef.current = setInterval(() => {
        currentProgress += 1;
        if (currentProgress >= 100) {
          setProgress(100);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        } else {
          setProgress(currentProgress);
        }
      }, stepDuration);
    }, 0);
    
    // Start typewriter animation immediately when button is clicked
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show full text instantly
      setWelcomeTextDisplay(welcomeTextFull);
      setWelcomeTextRevealed(true);
    } else {
      // Start typewriter animation - 0.75 seconds total
      const totalDuration = 750; // 0.75 seconds
      const characterCount = welcomeTextFull.length;
      // Calculate interval so last character appears at exactly 0.75 seconds
      // First character at 0ms, last at 750ms, so interval = 750 / (N-1)
      const interval = characterCount > 1 ? totalDuration / (characterCount - 1) : totalDuration;
      let currentIndex = 0;

      // Show first character immediately
      setWelcomeTextDisplay(welcomeTextFull.substring(0, 1));
      currentIndex = 1;

      const typeInterval = setInterval(() => {
        if (currentIndex < characterCount) {
          setWelcomeTextDisplay(welcomeTextFull.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setWelcomeTextRevealed(true);
          typewriterIntervalRef.current = null;
        }
      }, interval);

      typewriterIntervalRef.current = typeInterval;
    }
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('audioEnabled'));
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 100);
  };

  // Unified handler for both touch and click events
  const handleInteraction = async (e: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default only for touch events to avoid double-firing
    if ('touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    await handleClick();
  };

  return (
    <div 
      className="flex flex-col items-center" 
      style={{ 
        position: 'relative', 
        zIndex: 30, 
        pointerEvents: 'auto',
        touchAction: 'manipulation'
      }}
    >
      <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
        <button
          id="heroCta"
          ref={buttonRef}
          onClick={handleInteraction}
          onTouchEnd={handleInteraction}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            position: 'relative',
            zIndex: 30,
            pointerEvents: 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            minWidth: '44px',
            minHeight: '44px',
            cursor: 'pointer',
            WebkitTouchCallout: 'none',
            fontSize: isMobile ? '0.8625rem' : '1.725rem',
            padding: isMobile ? '12px 21px' : '24px 42px',
            ...(isMobile && { whiteSpace: 'nowrap' }),
          }}
          className="btn-void mt-10 uppercase tracking-[0.1em] inline-block"
        >
          <span className="relative z-[2]" style={{ pointerEvents: 'none', ...(isMobile && { whiteSpace: 'nowrap' }) }}>ENTER THE VOID</span>
        </button>
      </div>
      <span className="text-xs md:text-sm mt-2 block text-center presence-rebellion-flash" style={{ color: 'var(--voidMagenta)', fontFamily: 'var(--font-body), sans-serif' }}>
        Presence as Rebellion
      </span>
      
      {showLoading && (
        <div 
          ref={loadingRef}
          className="mt-4 flex items-center gap-2 md:gap-3 text-[#00FFFF]"
          style={{
            opacity: 1,
            filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            transition: 'none', // Remove transition to allow instant flicker
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)'
          }}
        >
          <div className="relative flex-shrink-0" style={{ width: 'clamp(0.875rem, 1.5vw, 1.25rem)', height: 'clamp(0.875rem, 1.5vw, 1.25rem)' }}>
            <svg className="transform -rotate-90" style={{ width: '100%', height: '100%' }} viewBox="0 0 20 20">
              {/* Background circle */}
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#00FFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 8}`}
                strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
          </div>
          <span 
            ref={welcomeTextRef}
            className="welcomeText font-medium"
            aria-live="polite"
          >
            {welcomeTextDisplay}
            <span className="sr-only">
              {welcomeTextRevealed ? welcomeTextFull : ''}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

