'use client';

import { useEffect, useState } from 'react';
import Intercom, { show } from '@intercom/messenger-js-sdk';
import './IntercomButton.css';

export default function IntercomButton() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Intercom with your app ID
    const appId = 'g0t8dac9';
    
    try {
      Intercom({
        app_id: appId,
        hide_default_launcher: true, // Hide the default Intercom launcher button
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Intercom:', error);
    }
  }, []);

  const handleOpenMessenger = () => {
    if (isInitialized) {
      try {
        show();
      } catch (error) {
        console.error('Failed to open Intercom:', error);
      }
    }
  };

  return (
    <div className="intercom-button-wrapper fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16">
      <button
        onClick={handleOpenMessenger}
        className="flex items-center justify-center w-full h-full rounded-full cursor-pointer transition-all duration-300 group hover:bg-black/90 active:scale-95"
        aria-label="Open chat"
        style={{
          fontFamily: 'var(--font-display), sans-serif',
          boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 255, 0.1)';
        }}
      >
        {/* Chat icon */}
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-[#00FFFF] transition-all duration-300 group-hover:text-[#00CCFF] group-hover:scale-110 relative z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}

