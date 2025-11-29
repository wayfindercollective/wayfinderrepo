'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimerData {
  remaining: number;
  endTime: number;
  phase: 'BLACK_FRIDAY' | 'CYBER_MONDAY';
  nextPhase: 'CYBER_MONDAY' | null;
  isNew: boolean;
}

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'BLACK_FRIDAY' | 'CYBER_MONDAY'>('BLACK_FRIDAY');
  const [hasExpired, setHasExpired] = useState(false);

  const fetchTimer = useCallback(async () => {
    try {
      const response = await fetch('/api/timer');
      const data: TimerData = await response.json();
      
      setTimeRemaining(data.remaining);
      setEndTime(data.endTime);
      setCurrentPhase(data.phase);
      setHasExpired(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch timer:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch timer data from API
    fetchTimer();
  }, [fetchTimer]);

  // Emit phase change event when phase updates
  useEffect(() => {
    if (!isLoading && currentPhase) {
      const event = new CustomEvent('timerPhaseChange', { detail: { phase: currentPhase } });
      window.dispatchEvent(event);
    }
  }, [currentPhase, isLoading]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    // Update timer every second
    const interval = setInterval(() => {
      if (endTime) {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);
        
        // When timer expires, automatically fetch next phase
        if (remaining <= 0 && !hasExpired) {
          setHasExpired(true);
          clearInterval(interval);
          // Small delay to ensure smooth transition, then fetch next phase
          setTimeout(() => {
            fetchTimer();
          }, 1000);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, timeRemaining, hasExpired, fetchTimer]);

  if (isLoading) {
    return (
      <div className="text-right text-white">
        <div className="text-xs text-gray-400">Loading...</div>
      </div>
    );
  }

  if (timeRemaining === null || timeRemaining <= 0) {
    return null; // Don't show anything if timer expired or failed
  }

  // Format time remaining
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center text-white w-full">
      <div className="timer-void flex flex-col items-center">
        <div className="text-white mb-0.5 opacity-80" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)', lineHeight: '1' }}>
          Black Friday
        </div>
        <div className="text-white mb-0.5 opacity-80" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)', lineHeight: '1' }}>
          Final Phase
        </div>
        <div className="font-bold text-white" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: '1.2', fontWeight: '600' }}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </div>
  );
}
