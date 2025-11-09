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

  // Listen for flicker data from HeroLogo to apply to all elements (intense flicker for first 0.75s)
  useEffect(() => {
    const handleFlickerData = (event: any) => {
      if (isFlickering && event.detail) {
        const { intensity, brightness } = event.detail;
        const opacity = Math.max(0.1, Math.min(1.0, intensity));
        // Use the same filter as the logo: contrast(1.4) brightness() saturate(1.2)
        const filterValue = `contrast(1.4) brightness(${brightness}) saturate(1.2)`;
        
        // Apply to body and all children, but exclude specific elements
        const body = document.body;
        if (body) {
          body.style.opacity = opacity.toString();
          body.style.filter = filterValue;
          body.style.webkitFilter = filterValue;
        }
        
        // Apply to all direct children of body, excluding specific elements
        const allElements = document.querySelectorAll('body > *');
        allElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          // Skip elements that already have specific flicker handling
          // Skip canvas elements (starfield)
          // Skip script and style tags
          // Skip timer element
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
      }
    };

    window.addEventListener('flickerData', handleFlickerData as EventListener);
    
    return () => {
      window.removeEventListener('flickerData', handleFlickerData as EventListener);
    };
  }, [isFlickering]);

  // Apply continuous flickering to text and logos after initial 0.75s
  useEffect(() => {
    if (isContinuousFlickering) {
      // Find all text elements and images/logos
      // Target headings, paragraphs, spans, links, buttons, labels, list items, etc.
      const textSelectors = 'h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, button';
      const textElements = document.querySelectorAll(textSelectors);
      const images = document.querySelectorAll('img');
      
      // Also get container elements that have text content
      const containers = document.querySelectorAll('section, article, header, footer, nav, main, aside, div');
      
      // Combine all elements
      const allElements = Array.from(textElements).concat(Array.from(images));
      
      // Add containers that contain text or images
      containers.forEach((container) => {
        const htmlContainer = container as HTMLElement;
        // Only include containers that have text content or images
        if (htmlContainer.textContent?.trim() || htmlContainer.querySelector('img, h1, h2, h3, h4, h5, h6, p, span, a')) {
          allElements.push(htmlContainer);
        }
      });
      
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
        
        // Add flicker class to text and logos
        htmlElement.classList.add('global-text-flicker');
      });
    } else {
      // Remove flicker class when continuous flickering stops
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const flickeringElements = document.querySelectorAll('.global-text-flicker');
        flickeringElements.forEach((element) => {
          element.classList.remove('global-text-flicker');
        });
      });
    }
  }, [isContinuousFlickering]);

  // Reset flickering when it stops
  useEffect(() => {
    if (!isFlickering) {
      // Reset body and all elements to their original state
      const body = document.body;
      if (body) {
        body.style.opacity = '';
        body.style.filter = '';
        body.style.webkitFilter = '';
      }
      
      const allElements = document.querySelectorAll('body > *');
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
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
    }
  }, [isFlickering]);


  return null; // This component doesn't render anything
}

