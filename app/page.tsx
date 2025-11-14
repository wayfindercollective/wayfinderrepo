'use client';

import { useState, useRef, useEffect } from "react";
import HeroLogo from "./components/HeroLogo";
import Pricing from "./components/Pricing";
import AnimatedSectionTitle from "./components/AnimatedSectionTitle";
import AnimatedColumn from "./components/AnimatedColumn";
import Timer from "./components/Timer";
import Image from "next/image";
import "./components/price.css";

// Extend Window interface for custom properties
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function Home() {
  const [hourglassRotations, setHourglassRotations] = useState<Record<string, number>>({});
  const [showWeekPackOverlay, setShowWeekPackOverlay] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
    if (commitSha) {
      console.log(`build ${commitSha}`);
    }
  }, []);

  // Create triangle sound effect for hourglass
  const playHourglassPing = () => {
    // Check if sound is enabled
    if (typeof window !== 'undefined') {
      const soundEnabled = localStorage.getItem('soundEnabled');
      if (soundEnabled === 'false') {
        return; // Don't play sound if disabled
      }
    }

    // Cooldown check: 300ms between plays
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 300) {
      return; // Still in cooldown
    }
    lastPlayTimeRef.current = now;

    try {
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext || AudioContext)();
      }
      const audioContext = audioContextRef.current;

      // Resume context if suspended (required by some browsers)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const currentTime = audioContext.currentTime;
      const duration = 0.25; // 250ms - short but with proper decay
      const baseFreq = 293.66; // D4 note

      // Create triangle wave sound
      const osc = audioContext.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, currentTime);
      
      const oscGain = audioContext.createGain();
      // Fast attack for ping
      oscGain.gain.setValueAtTime(0, currentTime);
      oscGain.gain.linearRampToValueAtTime(1.0, currentTime + 0.003);
      // Smooth decay
      oscGain.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
      
      // Master gain (moderate volume)
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3;

      // Connect: oscillator -> gain -> master gain -> destination
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      masterGain.connect(audioContext.destination);

      // Start oscillator
      osc.start(currentTime);
      osc.stop(currentTime + duration);
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('Could not play hourglass triangle sound:', error);
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
    // Trigger rotation only (sound removed)
    handleHourglassHover(id);
  };

  const handleColumnHover = () => {
    playHourglassPing();
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Timer in top-right corner */}
      <div id="timer-container" className="fixed top-4 right-1 z-50 px-2 py-1.5 md:px-5 md:py-3 origin-top-right scale-85 md:scale-95">
        <div className="text-white flex flex-col gap-1.5 md:gap-3 items-center">
          {/* Phase I */}
          <div className="text-white opacity-80 border border-[#00FFFF] px-1 py-1 md:px-2 md:py-1.5 rounded" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)', lineHeight: '1' }}>
            Phase I
          </div>
          {/* Black Friday Access */}
          <div className="text-white opacity-80 border border-[#00FFFF] px-1 py-1 md:px-2 md:py-1.5 rounded" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)', lineHeight: '1' }}>
            Black Friday Access
          </div>
          {/* Timer */}
          <div className="flex justify-center items-center w-full">
            <Timer />
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden z-10 bg-transparent min-h-screen flex items-center justify-center pt-16 md:pt-24">
        <div className="relative max-w-7xl mx-auto px-6 md:px-6 lg:px-8 w-full">
          <div className="text-center">
            <HeroLogo />

            {/* Your tagline and paragraph below the logo can remain */}
            <h2 className="h2-void mt-12 md:mt-8 md:-mt-4 text-center opacity-90" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
              Reality is broken. <span className="emphasis-word charisma-word">Charisma</span> bends it.
            </h2>

            <p className="text-gray-400 mb-8 md:mb-6 max-w-2xl mx-auto mt-4 md:mt-2 md:-mt-1" style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 'clamp(0.875rem, 1.8vw, 1.25rem)' }}>
              A private training space for real presence under pressure. Weekly lessons. Live practice. Real world reps. You do not binge. You build.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="what-you-get" className="voidSection relative z-10 md:mt-20">
        <div className="voidContainer md:!py-6">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-white sectionTitle sectionTitleOrange sectionTitleTight">
              <span className="inline-flex items-center gap-3">
                <Image 
                  src="/HourGlass.png" 
                  alt="" 
                  width={24} 
                  height={24} 
                  className="h-[1em] w-auto hourglass-icon cursor-pointer"
                  style={{ transform: `rotate(${(hourglassRotations['initiation-hourglass-left'] || 0) * 180}deg)` }}
                  onMouseEnter={(e) => handleHourglassIconHover('initiation-hourglass-left', e)}
                />
                <span className="headingText">INITIATION PACKAGE</span>
                <Image 
                  src="/HourGlass.png" 
                  alt="" 
                  width={24} 
                  height={24} 
                  className="h-[1em] w-auto hourglass-icon cursor-pointer"
                  style={{ transform: `rotate(${(hourglassRotations['initiation-hourglass-right'] || 0) * 180}deg)` }}
                  onMouseEnter={(e) => handleHourglassIconHover('initiation-hourglass-right', e)}
                />
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3">
            <AnimatedColumn direction="left">
              <div className="cardVoid p-6">
                <h3 className="text-base md:text-lg font-bold mb-3">Founders Annual Pass</h3>
                <p className="text-sm md:text-base">
                  Twelve months inside the program. Weekly lessons. Guided practices. Real world exercises. Live group sessions. Clear progress markers.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="fade">
              <div className="cardVoid p-6">
                <h3 className="text-base md:text-lg font-bold mb-3">The Field That Trains Back</h3>
                <p className="text-sm md:text-base">
                  People who show up, post results, and give useful feedback. Less talk. More proof.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-6">
                <h3 className="text-base md:text-lg font-bold mb-3">The Future Summons — Bootcamp Credit</h3>
                <p className="text-sm md:text-base">
                  $500 credit you can use for a Jeffy Bootcamp in 2025 or 2026.
                </p>
              </div>
            </AnimatedColumn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="voidSection voidSection-alt relative z-10 pb-8 md:pb-12">
        <div className="voidContainer md:!py-6">
          <Pricing />
        </div>
      </section>

      {/* Program Details Section */}
      <section className="voidSection relative z-10 pt-8 md:pt-12 md:mt-20">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-3xl md:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleMagenta">
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
                <span className="headingText">The Program</span>
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <AnimatedColumn direction="left" onHover={handleColumnHover}>
                <div className="cardVoid p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-1'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-1', e)}
                    />
                    <span style={{ fontFamily: 'var(--font-display), sans-serif' }}>Weekly Pack</span>
                  </h3>
                  <p className="text-base md:text-lg">
                    Each week you get a short lesson, a simple at-home practice, a small real world task, and a live session.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="right" onHover={handleColumnHover}>
                <div className="cardVoid p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-2'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-2', e)}
                    />
                    <span style={{ fontFamily: 'var(--font-display), sans-serif' }}>Skills we track</span>
                  </h3>
                  <p className="text-base md:text-lg">
                    State control. Nonverbals. Attention leadership.<br />
                    Calibration. Decisiveness. Spontaneity.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="left" onHover={handleColumnHover}>
                <div className="cardVoid p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-3'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-3', e)}
                    />
                    <span style={{ fontFamily: 'var(--font-display), sans-serif' }}>Sample practices</span>
                  </h3>
                  <p className="text-base md:text-lg">
                    Breathe and settle your weight. Hold eye contact. Pause for three beats before you speak. Lift the mood then land it sincere. Own a mistake and recover smoothly.
                  </p>
                </div>
              </AnimatedColumn>
              <AnimatedColumn direction="right" onHover={handleColumnHover}>
                <div className="cardVoid p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                    <Image 
                      src="/HourGlass.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-auto hourglass-icon cursor-pointer"
                      style={{ transform: `rotate(${(hourglassRotations['hourglass-4'] || 0) * 180}deg)` }}
                      onMouseEnter={(e) => handleHourglassIconHover('hourglass-4', e)}
                    />
                    <span style={{ fontFamily: 'var(--font-display), sans-serif' }}>Reset</span>
                  </h3>
                  <p className="text-base md:text-lg">
                    End of week check in that locks gains and sets your next step.
                  </p>
                </div>
              </AnimatedColumn>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setShowWeekPackOverlay(true)}
              className="text-cyan-400 hover:text-cyan-300 underline"
              style={{ fontSize: '168.75%', fontFamily: 'var(--font-mono), monospace' }}
            >
              See a Weekly Pack
            </button>
          </div>
        </div>
      </section>

      {/* WeekPack Overlay */}
      {showWeekPackOverlay && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 md:p-4"
          onClick={() => setShowWeekPackOverlay(false)}
        >
          <div 
            className="bg-gray-900 border border-cyan-500 rounded-lg p-2.5 md:p-6 max-w-4xl w-full flex flex-col md:flex-row gap-1.5 md:gap-4 items-center relative max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X button for mobile only */}
            <button
              onClick={() => setShowWeekPackOverlay(false)}
              className="md:hidden absolute top-2 right-2 text-white hover:text-cyan-400 transition-colors z-20 bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Close"
              style={{ fontSize: '24px', lineHeight: '1' }}
            >
              ×
            </button>
            {/* Right side - Doctrine Card Image */}
            <div className="flex-1 flex items-center justify-center w-full md:w-auto order-1 md:order-2">
              {/* Mobile - WIDE version */}
              <Image
                src="/Week 1 Doctrine Card WIDE.png"
                alt="Week 1 Doctrine Card"
                width={400}
                height={600}
                className="w-full h-auto md:hidden"
                unoptimized
              />
              {/* Desktop - Regular version */}
              <Image
                src="/Week 1 Doctrine Card.png"
                alt="Week 1 Doctrine Card"
                width={400}
                height={600}
                className="hidden md:block w-auto h-auto max-w-[400px] max-h-[80vh]"
                unoptimized
              />
            </div>
            
            {/* Left side - Sample Weekly Pack */}
            <div className="flex-1 w-full md:w-auto pt-1 md:pt-0 order-2 md:order-1">
              <h3 className="text-base md:text-2xl font-bold text-white mb-1.5 md:mb-4" style={{ fontFamily: 'var(--font-mono), monospace' }}><span className="text-cyan-400">🜂</span> SAMPLE WEEK PACK</h3>
              <div className="space-y-1.5 md:space-y-4 text-xs md:text-base text-gray-300" style={{ fontFamily: 'var(--font-mono), monospace' }}>
                <div>
                  <div className="font-bold text-white mb-1 md:mb-2 text-xs md:text-base">Doctrine — Presence {'>'} Persona</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1 md:mb-2 text-xs md:text-base">Home — Operator Baseline</div>
                  <div className="ml-4 text-xs md:text-base">4–2–6 breath.</div>
                  <div className="ml-4 mt-1 md:mt-2 text-xs md:text-base">Speak one line at half-speed:</div>
                  <div className="ml-4 italic text-xs md:text-base">"I'm not rushing for anyone."</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1 md:mb-2 text-xs md:text-base">Field — 90/10 Statement Drop</div>
                  <div className="ml-4 text-xs md:text-base">Say three statements before your first question.</div>
                  <div className="ml-4 mt-0.5 md:mt-1 text-xs md:text-base">Anchor the thread and own the tempo. No audition.</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1 md:mb-2 text-xs md:text-base">Signal Lab — Weekly Live Group Session</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1 md:mb-2 text-xs md:text-base"><span className="text-cyan-400">🜏</span> Reset — Operator Debrief</div>
                  <div className="ml-4 text-xs md:text-base">1 win, 1 glitch, 1 correction.</div>
                </div>
                <div className="pt-2 md:pt-3 border-t border-gray-700">
                  <div className="text-white font-bold text-xs md:text-base">Done.</div>
                  <div className="mt-0.5 md:mt-1 text-xs md:text-base">One week.</div>
                  <div className="mt-0.5 md:mt-1 text-xs md:text-base">Twenty-three missions left.</div>
                </div>
              </div>
              <button
                onClick={() => setShowWeekPackOverlay(false)}
                className="mt-1.5 md:mt-4 text-cyan-400 hover:text-cyan-300 underline text-xs md:text-base"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHY VOID UNDERGROUND */}
      <section className="voidSection voidSection-alt relative z-10">
        <div className="voidContainer">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <AnimatedSectionTitle className="text-3xl md:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleOrange">
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
                  <span className="headingText">Why Void Underground</span>
                </span>
              </AnimatedSectionTitle>
            </div>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
              Most charisma programs focus on theory. We focus on action.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <AnimatedColumn direction="left" onHover={handleColumnHover}>
              <div className="cardVoid p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Action first</h3>
                <p>
                  You learn by doing. The body teaches faster than theory.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right" onHover={handleColumnHover}>
              <div className="cardVoid p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Field tested</h3>
                <p>
                  Drills come from decades of live work and are built to be repeatable.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="left" onHover={handleColumnHover}>
              <div className="cardVoid p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Clear philosophy</h3>
                <p>
                  Presence over image. Lead reality with calm energy. Be the signal in the noise.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right" onHover={handleColumnHover}>
              <div className="cardVoid p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Proof and ethics</h3>
                <p>
                  Track results. Lead with consent. No tricks. No manipulation.
                </p>
              </div>
            </AnimatedColumn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative text-white overflow-hidden z-10 bg-transparent">
        <div className="relative max-w-7xl mx-auto px-6 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <AnimatedSectionTitle className="text-3xl md:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleCyan sectionTitleTight">
                <span className="inline-flex items-center gap-3">
                  <span className="cyan-dots-wrapper">
                    <Image 
                      src="/CyanDots.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-[1em] cyan-dots-icon"
                      style={{ aspectRatio: '1 / 1' }}
                    />
                  </span>
                  <span className="headingText">Investment</span>
                </span>
              </AnimatedSectionTitle>
            </div>
            <p className="text-base md:text-xl text-gray-300" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
              One-time payment for 12 months of premium access
            </p>
          </div>
          <div className="max-w-2xl mx-auto md:scale-[0.8] md:origin-center">
            <div className="cardVoid p-12 text-center" onMouseEnter={handleColumnHover}>
              <div className="mb-8" style={{ fontSize: '150%' }}>
                <div className="mb-2">
                  <span className="current-price-wrapper">
                    <span className="current-price">
                      $297
                    </span>
                  </span>
                </div>
                <div className="text-gray-300 mt-1 founders-annual-pass-title" style={{ fontSize: '200%', fontFamily: 'var(--font-display), sans-serif', letterSpacing: '0.02em', fontWeight: 800 }}>
                  <span className="block md:hidden">
                    Founders Annual Pass
                    <div className="mt-2 flex justify-center">
                      <span className="black-friday-special-sticker shiny-sticker">Black Friday Access</span>
                    </div>
                  </span>
                  <span className="hidden md:block">
                    Founders Annual<br />Pass
                    <div className="mt-2 flex justify-center">
                      <span className="black-friday-special-sticker shiny-sticker">Black Friday Access</span>
                    </div>
                  </span>
                </div>
                <div className="text-lg text-gray-300 mt-2">
                  Includes $500 credit for a Jeffy Bootcamp in 2025 or 2026.
                </div>
              </div>
              <div className="space-y-4 mb-8 text-left" style={{ fontSize: '150%' }}>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('investment-hourglass-1')}>
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
                  <span>Twelve months of premium content</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('investment-hourglass-2')}>
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
                  <span>Access to missions and live sessions</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('investment-hourglass-3')}>
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
                  <span>Simple practices you can do daily</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('investment-hourglass-4')}>
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
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('investment-hourglass-5')}>
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
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10" style={{ alignItems: 'center', alignContent: 'center' }}>
                <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
                  <a
                    id="enroll"
                    href="https://bookmyeventnow.com/register?a=new&p=32"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-void mt-10 inline-block"
                    style={{ fontSize: '1.15rem', padding: '16px 28px' }}
                  >
                    ENTER THE VOID
                  </a>
                  <span className="text-xs md:text-sm mt-2 block text-center accentMagenta presence-rebellion-flash" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
                    Presence as Rebellion
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-6" style={{ fontFamily: 'var(--font-mono), monospace' }}>
                One time payment for twelve months of access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Salt Glyph Transition Sigil */}
      <div className="relative w-full flex items-center justify-center py-8 md:py-12 overflow-hidden">
        <div className="salt-glyph-transition">
          <Image
            src="/Updated Salt Glyph.png"
            alt=""
            width={200}
            height={200}
            className="w-32 md:w-40 h-auto"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="voidSection relative z-10">
        <div className="voidContainer text-center">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-3xl md:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleCyan">
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
                <span className="headingText">FAQ</span>
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-lg md:text-xl font-bold">Is this a course?</h3>
                <span className="text-2xl">{openFAQ === 0 ? '−' : '+'}</span>
              </button>
              {openFAQ === 0 && (
                <p className="mt-4 text-gray-300">
                  It is a training space with weekly lessons and simple practices. You build skills and we measure progress.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-lg md:text-xl font-bold">Is this pickup?</h3>
                <span className="text-2xl">{openFAQ === 1 ? '−' : '+'}</span>
              </button>
              {openFAQ === 1 && (
                <p className="mt-4 text-gray-300">
                  No. This is consent forward charisma for dating, business, and leadership.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-lg md:text-xl font-bold">What changes in thirty days?</h3>
                <span className="text-2xl">{openFAQ === 2 ? '−' : '+'}</span>
              </button>
              {openFAQ === 2 && (
                <p className="mt-4 text-gray-300">
                  A calmer baseline, fewer freezes, and faster recovery when things get awkward.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-lg md:text-xl font-bold">I have more questions, how can I contact you guys?</h3>
                <span className="text-2xl">{openFAQ === 3 ? '−' : '+'}</span>
              </button>
              {openFAQ === 3 && (
                <div className="mt-4">
                  <p className="text-gray-300 mb-4">
                    Send us an email at: support@wayfindercoaching.net
                  </p>
                  <a
                    href="mailto:support@wayfindercoaching.net"
                    className="inline-block px-6 py-2.5 border border-cyan-400/60 rounded-lg text-white hover:border-cyan-400 transition-all duration-200"
                    style={{ 
                      fontSize: '1rem',
                      fontFamily: 'var(--font-display), sans-serif',
                      boxShadow: '0 0 12px rgba(0, 255, 255, 0.2), 0 0 4px rgba(0, 255, 255, 0.15)',
                      textShadow: '0 0 4px rgba(0, 255, 255, 0.3)'
                    }}
                  >
                    Send us a message
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-white border-t border-white/10 z-10 min-h-[200px] md:min-h-[300px]">
        {/* Signal Core Logo - Left */}
        <div className="absolute left-8 md:left-16 lg:left-24 bottom-0 top-0 flex items-center group">
          <div className="h-full w-auto relative signal-core-logo-wrapper" style={{ height: '200px', width: 'auto' }}>
            {/* Static text layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-[200px] md:h-full w-auto object-contain signal-core-logo-static"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 68%, 100% 68%, 100% 100%, 0% 100%)',
                height: '200px',
              }}
            />
            {/* Spinning top layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-[200px] md:h-full w-auto object-contain signal-core-logo-spin signal-core-logo-spin-left absolute top-0 left-0"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 68%, 0% 68%)',
                height: '200px',
              }}
            />
          </div>
        </div>
        {/* Signal Core Logo - Right */}
        <div className="absolute right-8 md:right-16 lg:right-24 bottom-0 top-0 flex items-center justify-end group">
          <div className="h-full w-auto relative signal-core-logo-wrapper" style={{ height: '200px', width: 'auto' }}>
            {/* Static text layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-[200px] md:h-full w-auto object-contain signal-core-logo-static"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 68%, 100% 68%, 100% 100%, 0% 100%)',
                height: '200px',
              }}
            />
            {/* Spinning top layer */}
            <Image
              src="/Signal_CoreLogo.png"
              alt=""
              width={1200}
              height={1200}
              className="h-[200px] md:h-full w-auto object-contain signal-core-logo-spin signal-core-logo-spin-right absolute top-0 left-0"
              unoptimized
              style={{
                filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                WebkitFilter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 68%, 0% 68%)',
                height: '200px',
              }}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 py-12 relative z-10">
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


