"use client";
import React from "react";
import Image from "next/image";
import "./signal-logo.css";

export default function SignalLogo() {
  return (
    <div className="signal-logo-container">
      <div className="signal-logo-wrapper">
        {/* Orbiting dots */}
        <div className="orbit orbit-1">
          <div className="dot dot-1"></div>
        </div>
        <div className="orbit orbit-2">
          <div className="dot dot-2"></div>
        </div>
        <div className="orbit orbit-3">
          <div className="dot dot-3"></div>
        </div>
        <div className="orbit orbit-4">
          <div className="dot dot-4"></div>
        </div>
        <div className="orbit orbit-5">
          <div className="dot dot-5"></div>
        </div>
        <div className="orbit orbit-6">
          <div className="dot dot-6"></div>
        </div>
        <div className="orbit orbit-7">
          <div className="dot dot-7"></div>
        </div>
        <div className="orbit orbit-8">
          <div className="dot dot-8"></div>
        </div>
        
        {/* Signal logo image */}
        <div className="signal-image-wrapper">
          <Image
            src="/Signal_CoreLogo.jpg"
            alt="Signal Core Logo"
            width={200}
            height={200}
            className="signal-image"
            priority
          />
        </div>
      </div>
    </div>
  );
}
