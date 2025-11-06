'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAlternatingSlideAnimationOptions {
  direction: 'left' | 'right';
  offset?: number; // Default 20px (between 16-24px)
  duration?: number; // Default 600ms
  threshold?: number; // IntersectionObserver threshold
}

export function useAlternatingSlideAnimation({
  direction,
  offset = 20,
  duration = 600,
  threshold = 0.1,
}: UseAlternatingSlideAnimationOptions) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Set initial position immediately on mount
  useEffect(() => {
    const element = elementRef.current;
    if (!element || shouldReduceMotion) return;

    const translateX = direction === 'left' ? -offset : offset;
    // Set initial state without transition to avoid animation on mount
    element.style.transition = 'none';
    element.style.transform = `translateX(${translateX}px)`;
    element.style.opacity = '0';
    
    // Force a reflow, then enable transitions for future animations
    element.offsetHeight; // Trigger reflow
    requestAnimationFrame(() => {
      if (element) {
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      }
    });
  }, [direction, offset, duration, shouldReduceMotion]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset when scrolled out so it plays again when re-entering
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Apply styles directly to the element
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (shouldReduceMotion) {
      // No animation for reduced motion preference
      element.style.transform = '';
      element.style.opacity = '1';
      element.style.transition = '';
      return;
    }

    const translateX = direction === 'left' ? -offset : offset;
    
    // Set initial state (hidden and offset)
    if (!isVisible) {
      element.style.transform = `translateX(${translateX}px)`;
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    } else {
      // Slide in when visible
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    }
  }, [isVisible, direction, offset, duration, shouldReduceMotion]);

  return { elementRef };
}
