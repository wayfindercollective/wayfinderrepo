'use client';

import { useEffect, useState, useRef } from 'react';

export default function GlobalFlickerEffect() {
  const [isFlickering, setIsFlickering] = useState(false);
  const [isContinuousFlickering, setIsContinuousFlickering] = useState(false);
  const continuousFlickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for audio enabled to start flickering
  useEffect(() => {
    const handleAudioEnabled = () => {
      // Clear any existing timeout
      if (continuousFlickerTimeoutRef.current) {
        clearTimeout(continuousFlickerTimeoutRef.current);
        continuousFlickerTimeoutRef.current = null;
      }
      
      // Reset states first
      setIsContinuousFlickering(false);
      setIsFlickering(true);
      
      // After 0.75 seconds, switch to continuous flickering for text/logos
      continuousFlickerTimeoutRef.current = setTimeout(() => {
        setIsFlickering(false);
        setIsContinuousFlickering(true);
        continuousFlickerTimeoutRef.current = null;
      }, 750);
    };

    const handleAudioEnded = () => {
      // Clear any pending timeout
      if (continuousFlickerTimeoutRef.current) {
        clearTimeout(continuousFlickerTimeoutRef.current);
        continuousFlickerTimeoutRef.current = null;
      }
      
      // Stop all flickering when audio ends
      setIsFlickering(false);
      setIsContinuousFlickering(false);
    };

    window.addEventListener('audioEnabled', handleAudioEnabled);
    window.addEventListener('audioEnded', handleAudioEnded);
    
    return () => {
      window.removeEventListener('audioEnabled', handleAudioEnabled);
      window.removeEventListener('audioEnded', handleAudioEnded);
      if (continuousFlickerTimeoutRef.current) {
        clearTimeout(continuousFlickerTimeoutRef.current);
      }
    };
  }, []);

  // Cache body children to avoid repeated queries
  const bodyChildrenRef = useRef<HTMLElement[]>([]);

  // Listen for flicker data from HeroLogo to apply to all elements (intense flicker for first 0.75s)
  useEffect(() => {
    const handleFlickerData = (event: Event) => {
      const flickerEvent = event as CustomEvent<{ intensity: number; brightness: number }>;
      if (isFlickering && flickerEvent.detail) {
        const { intensity, brightness } = flickerEvent.detail;
        const opacity = Math.max(0.1, Math.min(1.0, intensity));
        // Use the same filter as the logo: contrast(1.4) brightness() saturate(1.2)
        const filterValue = `contrast(1.4) brightness(${brightness}) saturate(1.2)`;
        
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          // Apply to body
          const body = document.body;
          if (body) {
            body.style.opacity = opacity.toString();
            body.style.filter = filterValue;
            body.style.webkitFilter = filterValue;
          }
          
          // Cache body children if not already cached
          if (bodyChildrenRef.current.length === 0) {
            bodyChildrenRef.current = Array.from(document.querySelectorAll('body > *')) as HTMLElement[];
          }
          
          // Apply to cached body children, excluding specific elements
          bodyChildrenRef.current.forEach((htmlElement) => {
            // Skip elements that already have specific flicker handling
            if (
              htmlElement.id === 'heroCta' ||
              htmlElement.id === 'timer-container' ||
              htmlElement.classList.contains('starfieldCanvas') ||
              htmlElement.tagName === 'SCRIPT' ||
              htmlElement.tagName === 'STYLE' ||
              htmlElement.tagName === 'NOSCRIPT' ||
              htmlElement.querySelector('.timer-void') ||
              htmlElement.querySelector('[class*="timer"]')
            ) {
              return;
            }
            
            // Apply flicker effect
            htmlElement.style.opacity = opacity.toString();
            htmlElement.style.filter = filterValue;
            htmlElement.style.webkitFilter = filterValue;
          });
        });
      }
    };

    window.addEventListener('flickerData', handleFlickerData as EventListener);
    
    return () => {
      window.removeEventListener('flickerData', handleFlickerData as EventListener);
    };
  }, [isFlickering]);

  // Cache elements to avoid repeated DOM queries
  const flickerElementsRef = useRef<Set<HTMLElement>>(new Set());

  // Apply continuous flickering to text and logos after initial 0.75s
  useEffect(() => {
    if (isContinuousFlickering) {
      // Use requestAnimationFrame to batch DOM operations
      requestAnimationFrame(() => {
        // Only query if cache is empty or if we need to refresh
        if (flickerElementsRef.current.size === 0) {
          // Find all text elements and images/logos - use more specific selectors
          const textSelectors = 'h1, h2, h3, h4, h5, h6, p, span:not(.starfieldCanvas *), a:not(.starfieldCanvas *), li, td, th, label, button';
          const textElements = document.querySelectorAll(textSelectors);
          const images = document.querySelectorAll('img:not(.starfieldCanvas *)');
          
          // Combine elements
          const allElements = Array.from(textElements).concat(Array.from(images));
          
          // Filter and cache elements
          allElements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            
            // Skip starfield canvas and background elements
            if (
              htmlElement.classList.contains('starfieldCanvas') ||
              htmlElement.tagName === 'SCRIPT' ||
              htmlElement.tagName === 'STYLE' ||
              htmlElement.tagName === 'NOSCRIPT' ||
              htmlElement.closest('.starfieldCanvas') ||
              htmlElement.closest('canvas.starfieldCanvas')
            ) {
              return;
            }
            
            // Skip if it's a background canvas (starfield)
            if (htmlElement.tagName === 'CANVAS' && htmlElement.classList.contains('starfieldCanvas')) {
              return;
            }
            
            // Skip the EnableSoundButton itself
            if (htmlElement.id === 'heroCta' || htmlElement.closest('#heroCta')) {
              return;
            }
            
            // Skip timer elements
            if (htmlElement.id === 'timer-container' || htmlElement.classList.contains('timer-void') || htmlElement.closest('.timer-void') || htmlElement.closest('#timer-container') || htmlElement.querySelector('.timer-void')) {
              return;
            }
            
            // Cache and add flicker class
            flickerElementsRef.current.add(htmlElement);
            htmlElement.classList.add('global-text-flicker');
          });
        } else {
          // Use cached elements
          flickerElementsRef.current.forEach((element) => {
            if (document.contains(element)) {
              element.classList.add('global-text-flicker');
            } else {
              // Remove stale references
              flickerElementsRef.current.delete(element);
            }
          });
        }
      });
    } else {
      // Remove flicker class when continuous flickering stops
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        flickerElementsRef.current.forEach((element) => {
          if (document.contains(element)) {
            element.classList.remove('global-text-flicker');
          } else {
            // Remove stale references
            flickerElementsRef.current.delete(element);
          }
        });
      });
    }
  }, [isContinuousFlickering]);

  // Reset flickering when it stops
  useEffect(() => {
    if (!isFlickering) {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        // Reset body
        const body = document.body;
        if (body) {
          body.style.opacity = '';
          body.style.filter = '';
          body.style.webkitFilter = '';
        }
        
        // Use cached body children
        bodyChildrenRef.current.forEach((htmlElement) => {
          if (
            htmlElement.id === 'heroCta' ||
            htmlElement.id === 'timer-container' ||
            htmlElement.classList.contains('starfieldCanvas') ||
            htmlElement.tagName === 'SCRIPT' ||
            htmlElement.tagName === 'STYLE' ||
            htmlElement.tagName === 'NOSCRIPT' ||
            htmlElement.querySelector('.timer-void') ||
            htmlElement.querySelector('[class*="timer"]')
          ) {
            return;
          }
          
          htmlElement.style.opacity = '';
          htmlElement.style.filter = '';
          htmlElement.style.webkitFilter = '';
        });
      });
    }
  }, [isFlickering]);


  return null; // This component doesn't render anything
}

