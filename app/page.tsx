'use client';

import { useState, useRef } from "react";
import HeroLogo from "./components/HeroLogo";
import Pricing from "./components/Pricing";
import AnimatedSectionTitle from "./components/AnimatedSectionTitle";
import AnimatedColumn from "./components/AnimatedColumn";
import Image from "next/image";
import "./components/price.css";

export default function Home() {
  const [hourglassRotations, setHourglassRotations] = useState<Record<string, number>>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create crystal clear ping sound for hourglass
  const playHourglassPing = () => {
    // Check if sound is enabled
    if (typeof window !== 'undefined') {
      const soundEnabled = localStorage.getItem('soundEnabled');
      if (soundEnabled === 'false') {
        return; // Don't play sound if disabled
      }
    }

    try {
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      // Resume context if suspended (required by some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create oscillator for the ping sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Set frequency to a high, bright tone (like champagne flute tap)
      // Using a high frequency around 2000-3000 Hz for that crystal clear ping
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(2500, audioContext.currentTime);
      
      // Add a slight frequency sweep for more character (optional)
      oscillator.frequency.exponentialRampToValueAtTime(2200, audioContext.currentTime + 0.05);

      // Set gain envelope for natural decay
      // Volume 0.25 as specified
      const peakGain = 0.25;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, audioContext.currentTime + 0.01); // Quick attack
      // Natural decay over 600ms (middle of 400-900ms range)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.61);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play the sound (no loop)
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.61); // 610ms duration
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('Could not play hourglass ping sound:', error);
    }
  };

  const handleHourglassHover = (id: string) => {
    setHourglassRotations(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleHourglassIconHover = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card hover
    // Only play sound, rotation is handled by card hover
    playHourglassPing();
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden z-10 -mt-8 sm:-mt-12 bg-transparent">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-2">
          <div className="text-center">
            <HeroLogo />

            {/* Your tagline and paragraph below the logo can remain */}
            <h2 className="h2-void -mt-4 text-center opacity-90">
              Transform Your <span className="emphasis-word">Charisma</span> Through <span className="emphasis-word">Action</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 mb-6 max-w-2xl mx-auto -mt-1">
              Join a community driven program with missions, tasks, and real world practice.
              Master the art of charisma through consistent action and learning.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="voidSection relative z-10">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-4xl sm:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleOrange">
              <span className="inline-flex items-center gap-3">
                <span className="cyan-dots-wrapper">
                  <Image 
                    src="/CyanDots.png" 
                    alt="" 
                    width={24} 
                    height={24} 
                    className="h-[1em] w-auto cyan-dots-icon"
                  />
                </span>
                What You Get
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedColumn direction="left">
              <div className="cardVoid p-8">
                <h3 className="text-xl font-bold mb-4">Community Missions</h3>
                <p>
                  Engage with like-minded individuals through structured missions that push you out of your comfort zone and into real-world charisma practice.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="fade">
              <div className="cardVoid p-8">
                <h3 className="text-xl font-bold mb-4">Monthly Content</h3>
                <p>
                  Access $50 worth of premium content each month, including strategies, techniques, and insights from Charisma in the Void.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-xl font-bold mb-4">A $500 credit towards a Jeffy 2025-2026 Bootcamp</h3>
                <p>
                  Learn from the founder of Charisma in the Void: Jeffy. Teaching bootcamps since the 2000's helping gain real life experience.
                </p>
              </div>
            </AnimatedColumn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="voidSection relative z-10">
        <div className="voidContainer">
          <Pricing />
        </div>
      </section>

      {/* Program Details Section */}
      <section className="voidSection relative z-10">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-4xl sm:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleMagenta">
              <span className="inline-flex items-center gap-3">
                <span className="cyan-dots-wrapper">
                  <Image 
                    src="/CyanDots.png" 
                    alt="" 
                    width={24} 
                    height={24} 
                    className="h-[1em] w-auto cyan-dots-icon"
                  />
                </span>
                The Program
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <AnimatedColumn direction="left">
                <div className="cardVoid p-8" onMouseEnter={() => handleHourglassHover('hourglass-1')}>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-1'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-1', e)}
                    />
                    12 Months of Content
                  </h3>
                  <p className="text-lg">
                    Get access to 12 months of premium charisma coaching content, normally $50/month. 
                    This bundle represents $1200 of value for just $297—a 50% discount.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="right">
                <div className="cardVoid p-8" onMouseEnter={() => handleHourglassHover('hourglass-2')}>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-2'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-2', e)}
                    />
                    Community-Driven Learning
                  </h3>
                  <p className="text-lg">
                    Join a vibrant community of individuals committed to improving their charisma. 
                    Share experiences, get feedback, and grow together.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="left">
                <div className="cardVoid p-8" onMouseEnter={() => handleHourglassHover('hourglass-3')}>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-3'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-3', e)}
                    />
                    Missions & Tasks
                  </h3>
                  <p className="text-lg">
                    Participate in carefully designed missions and tasks that get you into action. 
                    Learning happens through doing, not just consuming content.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="right">
                <div className="cardVoid p-8" onMouseEnter={() => handleHourglassHover('hourglass-4')}>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-4'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-4', e)}
                    />
                    From Charisma in the Void
                  </h3>
                  <p className="text-lg">
                    Created by the coach behind the popular YouTube channel "Charisma in the Void". 
                    Proven strategies and techniques that actually work.
                  </p>
                </div>
              </AnimatedColumn>
            </div>
          </div>
        </div>
      </section>

      {/* WHY VOID UNDERGROUND */}
      <section className="voidSection relative z-10">
        <div className="voidContainer">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <AnimatedSectionTitle className="text-4xl sm:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleOrange">
                <span className="inline-flex items-center gap-3">
                  <span className="cyan-dots-wrapper">
                    <Image 
                      src="/CyanDots.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto cyan-dots-icon"
                    />
                  </span>
                  Why Void Underground?
                </span>
              </AnimatedSectionTitle>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Most charisma programs focus on theory. We focus on action.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <AnimatedColumn direction="left">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Action Over Theory</h3>
                <p>
                  You won't just read about charisma—you'll practice it. Our missions and tasks 
                  ensure you're actively developing your skills in real-world situations.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Community Support</h3>
                <p>
                  Learn alongside others on the same journey. Share victories, get support during 
                  challenges, and build lasting connections.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="left">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Proven Content</h3>
                <p>
                  Based on the successful Charisma in the Void YouTube channel. These aren't 
                  experimental ideas—they're tested strategies that deliver results.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Exceptional Value</h3>
                <p>
                  $1200 worth of premium content for just $297. That's 12 months of $50/month 
                  programs bundled at a 50% discount.
                </p>
              </div>
            </AnimatedColumn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative text-white overflow-hidden z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <AnimatedSectionTitle className="text-4xl sm:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleCyan">
                <span className="inline-flex items-center gap-3">
                  <span className="cyan-dots-wrapper">
                    <Image 
                      src="/CyanDots.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto cyan-dots-icon"
                    />
                  </span>
                  Investment
                </span>
              </AnimatedSectionTitle>
            </div>
            <p className="text-xl text-gray-300">
              One-time payment for 12 months of premium access
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="cardVoid p-12 text-center">
              <div className="mb-8" style={{ fontSize: '150%' }}>
                <div className="current-price mb-2">
                  $297
                </div>
                <div className="text-2xl text-gray-400 line-through mb-2">$1200 value</div>
                <div className="text-lg text-purple-400 font-semibold">50% Discount</div>
              </div>
              <div className="space-y-4 mb-8 text-left" style={{ fontSize: '150%' }}>
                <div className="flex items-center gap-3">
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-1'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-1', e)}
                  />
                  <span>12 months of premium content</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-2'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-2', e)}
                  />
                  <span>Access to community missions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-3'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-3', e)}
                  />
                  <span>Action-oriented tasks and exercises</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-4'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-4', e)}
                  />
                  <span>Community support and feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-5'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-5', e)}
                  />
                  <span>From Charisma in the Void</span>
                </div>
              </div>
              <a
                id="enroll"
                href="https://bookmyeventnow.com/register?a=new&p=32"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3
                           bg-black text-white border border-white/10 shadow-md
                           transition duration-200 ease-out
                           hover:-translate-y-0.5 hover:shadow-xl hover:text-cyan-300
                           focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                           w-full sm:w-auto"
              >
                Get your Founders Annual Pass Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-white border-t border-white/10 z-10">
        {/* Signal Core Logo - Left */}
        <div className="absolute left-0 bottom-0 top-0 flex items-center group">
          <div className="h-full w-auto relative signal-core-logo-wrapper">
            {/* Static text layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-full w-auto object-contain signal-core-logo-static"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 68%, 100% 68%, 100% 100%, 0% 100%)',
              }}
            />
            {/* Spinning top layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-full w-auto object-contain signal-core-logo-spin signal-core-logo-spin-left absolute top-0 left-0"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 68%, 0% 68%)',
              }}
            />
          </div>
        </div>
        {/* Signal Core Logo - Right */}
        <div className="absolute right-0 bottom-0 top-0 flex items-center justify-end group">
          <div className="h-full w-auto relative signal-core-logo-wrapper">
            {/* Static text layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-full w-auto object-contain signal-core-logo-static"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 68%, 100% 68%, 100% 100%, 0% 100%)',
              }}
            />
            {/* Spinning top layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-full w-auto object-contain signal-core-logo-spin signal-core-logo-spin-right absolute top-0 left-0"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 68%, 0% 68%)',
              }}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="max-w-md mx-auto relative group">
              <Image
                src="/Master_Logo.png"
                alt="Void Underground"
                width={800}
                height={200}
                className="w-full h-auto"
                style={{
                  filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
                  WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
                }}
              />
              {/* cyan line tucked under UNDERGROUND */}
              <span
                aria-hidden
                className="
                  absolute left-1/2 -translate-x-1/2
                  block w-0 h-[6px] rounded-full
                  bg-[#0FF]
                  shadow-[0_0_10px_#0FF,0_0_24px_rgba(0,255,255,0.5)]
                  transition-[width] duration-400 ease-out
                  group-hover:w-[86%]
                  z-10
                "
                style={{ top: '60%' }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
