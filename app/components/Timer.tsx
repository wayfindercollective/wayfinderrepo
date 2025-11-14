'use client';

import { useState, useEffect } from 'react';

interface TimerData {
  remaining: number;
  endTime: number;
  isNew: boolean;
}

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    // Fetch timer data from API
    const fetchTimer = async () => {
      try {
        const response = await fetch('/api/timer');
        const data: TimerData = await response.json();
        
        setTimeRemaining(data.remaining);
        setEndTime(data.endTime);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch timer:', error);
        setIsLoading(false);
      }
    };

    fetchTimer();
  }, []);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    // Update timer every second
    const interval = setInterval(() => {
      if (endTime) {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, timeRemaining]);

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
    <div className="text-white flex flex-col items-center justify-center w-full">
      <div className="timer-void flex flex-col items-center justify-center gap-1 md:gap-2 w-full">
        <div className="text-white opacity-80 text-center whitespace-nowrap mx-auto" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)', lineHeight: '1' }}>
          Time Remaining
        </div>
        <div className="font-bold text-white text-center whitespace-nowrap mx-auto" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', lineHeight: '1.2', fontWeight: '600' }}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </div>
  );
}

