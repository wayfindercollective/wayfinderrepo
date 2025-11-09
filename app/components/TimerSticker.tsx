'use client';

import { useState, useEffect } from 'react';
import '../components/price.css';

interface TimerData {
  remaining: number;
  endTime: number;
  isNew: boolean;
}

export default function TimerSticker() {
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

  if (isLoading || timeRemaining === null || timeRemaining <= 0) {
    return null; // Don't show sticker if loading or expired
  }

  // Format time remaining for sticker (compact format with seconds and "left")
  const totalSeconds = Math.floor((timeRemaining || 0) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let displayText = '';
  if (hours > 0) {
    displayText = `${hours}h ${minutes}m ${seconds}s left`;
  } else if (minutes > 0) {
    displayText = `${minutes}m ${seconds}s left`;
  } else {
    displayText = `${seconds}s left`;
  }

  return (
    <span className="timer-sticker shiny-sticker">
      {displayText}
    </span>
  );
}

