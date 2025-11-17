"use client";
import React, { useEffect, useRef, useState } from "react";
import "./price.css";

// Seeded random function for deterministic random values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Small helper to turn a string into "shards" that can fly apart on hover
function makeShards(text: string) {
  return [...text].map((ch, i) => {
    // Use character index and char code as seed for deterministic randomness
    const seed = i * 1000 + ch.charCodeAt(0);
    // random but stable offsets so it looks organic - much larger distances to fly off screen
    const dx = (seededRandom(seed) * 800 - 400).toFixed(0) + "px";
    const dy = (seededRandom(seed + 1) * 600 - 300).toFixed(0) + "px";
    const rot = (seededRandom(seed + 2) * 720 - 360).toFixed(0) + "deg";
    return (
      <span
        key={i}
        className="shard"
        style={
          {
            "--dx": dx,
            "--dy": dy,
            "--rot": rot,
          } as React.CSSProperties
        }
      >
        {ch}
      </span>
    );
  });
}

export default function Price() {
  const priceRef = useRef<HTMLDivElement>(null);
  const [isFlickering, setIsFlickering] = useState(false);
  const [isBlinkPulsing, setIsBlinkPulsing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioEnabledRef = useRef(false);

  // Listen for audioEnabled event to trigger blink-pulse animation
  useEffect(() => {
    const handleAudioEnabled = () => {
      // Debounce: only apply once
      if (audioEnabledRef.current) return;
      audioEnabledRef.current = true;
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
        // Start blink-pulse animation immediately
        setIsBlinkPulsing(true);
      }
    };

    window.addEventListener('audioEnabled', handleAudioEnabled);
    
    return () => {
      window.removeEventListener('audioEnabled', handleAudioEnabled);
    };
  }, []);

  useEffect(() => {
    const element = priceRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            // Start flickering
            setIsFlickering(true);
            // Stop flickering after 5 seconds
            timeoutRef.current = setTimeout(() => {
              setIsFlickering(false);
            }, 5000);
          } else {
            // Reset when scrolling away
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setIsFlickering(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={priceRef} className="price-wrap">
      <div className="price-row">
        <span className="current-price-wrapper">
          <span 
            className={`current-price ${isFlickering ? 'flickering' : ''} ${isBlinkPulsing ? 'blink-pulse' : ''}`}
            data-price-primary="true"
            aria-hidden="true"
          >
            $297
          </span>
        </span>
        <span className="discount-note">73% Discount</span>
      </div>
      <div className="meta-row value-row">
        <span className="strike" title="Original price">
          {makeShards("$600 value")}
        </span>
      </div>
      <div className="meta-row">
        <span className="bootcamp-credit">
          <span className="credit-pulse">+ $500 credit</span> toward a Jeffy Bootcamp in 2025 or 2026
        </span>
      </div>
    </div>
  );
}
