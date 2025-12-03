'use client';

import { useState, useRef, useEffect } from "react";
import HeroLogo from "./components/HeroLogo";
import Pricing from "./components/Pricing";
import AnimatedSectionTitle from "./components/AnimatedSectionTitle";
import AnimatedColumn from "./components/AnimatedColumn";
import Image from "next/image";
import { show } from '@intercom/messenger-js-sdk';
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
      {/* Hero Section */}
      <section className="relative text-white overflow-visible z-10 bg-transparent min-h-[70vh] md:min-h-[50vh] lg:min-h-[500px] flex items-center justify-center pt-8 md:pt-20 lg:pt-24 pb-8 md:pb-12 lg:pb-0">
        <div className="relative max-w-7xl mx-auto px-6 md:px-6 lg:px-8 w-full">
          <div className="text-center">
            <HeroLogo />
          </div>
        </div>
      </section>

      {/* YouTube Embed Section */}
      <section className="relative z-[5] md:mt-8 lg:-mt-[120px]" style={{ paddingTop: '0px', paddingBottom: '30px' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8">
          {/* YouTube Embed */}
          <div className="w-full mx-auto" style={{ maxWidth: '720px', border: '2px solid rgba(0, 255, 255, 0.2)', borderRadius: '4px', boxShadow: '0 0 8px rgba(0, 255, 255, 0.15)' }}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Eqwvv6dhow4"
                title="THE INITIATION"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          </div>
          
          {/* Text below embed */}
          <div className="text-center mt-8">
            <h2 className="h2-void text-center opacity-90" style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
              Reality is broken. <span className="emphasis-word charisma-word">presence</span> bends it.
            </h2>

            <p className="text-gray-400 mb-8 md:mb-6 max-w-xl mx-auto mt-4 md:mt-2 md:-mt-1" style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)' }}>
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
                  loading="lazy"
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
                  loading="lazy"
                  style={{ transform: `rotate(${(hourglassRotations['initiation-hourglass-right'] || 0) * 180}deg)` }}
                  onMouseEnter={(e) => handleHourglassIconHover('initiation-hourglass-right', e)}
                />
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
            <AnimatedColumn direction="left">
              <div className="cardVoid p-6">
                <h3 className="text-base md:text-lg font-bold mb-3">Annual Pass</h3>
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
                    loading="lazy"
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
                      loading="lazy"
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
                loading="lazy"
              />
              {/* Desktop - Regular version */}
              <Image
                src="/Week 1 Doctrine Card.png"
                alt="Week 1 Doctrine Card"
                width={400}
                height={600}
                className="hidden md:block w-auto h-auto max-w-[400px] max-h-[80vh]"
                loading="lazy"
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
              Most 'charisma' programs focus on theory. We focus on action.
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
            <div className="sectionTitleWrapper relative">
              <AnimatedSectionTitle className="text-3xl md:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleCyan sectionTitleTight">
                <span className="inline-flex items-center gap-3 relative">
                  <span className="cyan-dots-wrapper absolute -left-12 md:-left-16">
                    <Image 
                      src="/CyanDots.png" 
                      alt="" 
                      width={24} 
                      height={24} 
                      className="h-[1em] w-[1em] cyan-dots-icon"
                      style={{ aspectRatio: '1 / 1' }}
                    />
                  </span>
                  <span className="headingText" style={{ fontFamily: 'var(--font-display), sans-serif' }}>Investment</span>
                </span>
              </AnimatedSectionTitle>
            </div>
            <p className="text-base md:text-xl text-gray-300 mx-auto" style={{ fontFamily: 'var(--font-body), sans-serif', textAlign: 'center', width: '100%', paddingLeft: '0.5rem' }}>
              Choose your access plan
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Annual Pass - Left */}
            <div className="cardVoid p-12 text-center" onMouseEnter={handleColumnHover}>
              <div className="mb-8" style={{ fontSize: '150%' }}>
                <div className="mb-2">
                  <span className="current-price-wrapper">
                    <span className="current-price">
                      $594
                    </span>
                  </span>
                </div>
                <div className="text-gray-300 mt-1" style={{ fontSize: '200%', fontFamily: 'var(--font-display), sans-serif', letterSpacing: '0.02em', fontWeight: 700 }}>
                  Annual Pass
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
                    loading="lazy"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['investment-hourglass-1'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('investment-hourglass-1', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Twelve months of premium content</span>
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
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Access to missions and live sessions</span>
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
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Simple practices you can do daily</span>
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
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Community support and feedback</span>
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
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>From Presence in the Void</span>
                </div>
              </div>
              <div className="mb-8 text-center">
                <span className="bootcamp-credit">
                  <span className="credit-pulse">+ $300 credit</span> toward a Jeffy Bootcamp in 2025 or 2026
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 mt-4">
                <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
                  <a
                    id="enroll-annual"
                    href="https://bookmyeventnow.com/register?a=new&p=32"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-void mt-4 uppercase tracking-[0.1em] inline-block"
                    style={{ 
                      fontSize: '1.15rem', 
                      padding: '16px 28px', 
                      position: 'relative',
                      zIndex: 20,
                      pointerEvents: 'auto',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      WebkitTouchCallout: 'none',
                      minWidth: '44px',
                      minHeight: '44px',
                      fontFamily: 'var(--font-display), sans-serif'
                    }}
                  >
                    <span className="relative z-[2]" style={{ pointerEvents: 'none', fontFamily: 'var(--font-display), sans-serif' }}>ENTER THE VOID</span>
                  </a>
                  <span className="text-xs md:text-sm mt-2 block text-center presence-rebellion-flash cyan-text" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
                    Presence as Rebellion
                  </span>
                </div>
              </div>
              <p className="text-base text-gray-400 mt-6" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '1.25rem' }}>
                One time payment for 12 months of access. Subscription-based.
              </p>
            </div>

            {/* Monthly Pass - Right */}
            <div className="cardVoid p-12 text-center" onMouseEnter={handleColumnHover} style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
              <div className="mb-8" style={{ fontSize: '150%' }}>
                <div className="mb-2">
                  <span className="current-price-wrapper">
                    <span className="current-price" style={{ 
                      color: '#000000',
                      WebkitTextStroke: '2px #ff00ff',
                      textShadow: '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)'
                    } as React.CSSProperties}>
                      $50
                    </span>
                  </span>
                </div>
                <div className="text-gray-300 mt-1" style={{ fontSize: '200%', fontFamily: 'var(--font-display), sans-serif', letterSpacing: '0.02em', fontWeight: 700 }}>
                  Monthly Pass
                </div>
              </div>
              <div className="space-y-4 mb-8 text-left" style={{ fontSize: '150%' }}>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('monthly-hourglass-1')}>
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    loading="lazy"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['monthly-hourglass-1'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))',
                      WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('monthly-hourglass-1', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Monthly premium content</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('monthly-hourglass-2')}>
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['monthly-hourglass-2'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))',
                      WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('monthly-hourglass-2', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Access to missions and live sessions</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('monthly-hourglass-3')}>
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['monthly-hourglass-3'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))',
                      WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('monthly-hourglass-3', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Simple practices you can do daily</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('monthly-hourglass-4')}>
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['monthly-hourglass-4'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))',
                      WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('monthly-hourglass-4', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>Community support and feedback</span>
                </div>
                <div className="flex items-center gap-3" onMouseEnter={() => handleHourglassHover('monthly-hourglass-5')}>
                  <Image 
                    src="/HourGlass.png" 
                    alt="" 
                    width={36} 
                    height={36} 
                    className="hourglass-icon cursor-pointer"
                    style={{ 
                      transform: `rotate(${(hourglassRotations['monthly-hourglass-5'] || 0) * 180}deg)`,
                      height: '1em',
                      width: 'auto',
                      filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))',
                      WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(7500%) hue-rotate(300deg) brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 12px rgba(255, 0, 255, 0.7))'
                    }}
                    onMouseEnter={(e) => handleHourglassIconHover('monthly-hourglass-5', e)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono), monospace' }}>From Presence in the Void</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 mt-4">
                <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
                  <a
                    id="enroll-monthly"
                    href="https://bookmyeventnow.com/register?a=new&p=33"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-void btn-void-magenta mt-4 uppercase tracking-[0.1em] inline-block"
                    style={{ 
                      fontSize: '1.15rem', 
                      padding: '16px 28px', 
                      position: 'relative',
                      zIndex: 20,
                      pointerEvents: 'auto',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      WebkitTouchCallout: 'none',
                      minWidth: '44px',
                      minHeight: '44px',
                      fontFamily: 'var(--font-display), sans-serif'
                    }}
                  >
                    <span className="relative z-[2]" style={{ pointerEvents: 'none', fontFamily: 'var(--font-display), sans-serif' }}>ENTER THE VOID</span>
                  </a>
                  <span className="text-xs md:text-sm mt-2 block text-center accentMagenta presence-rebellion-flash" style={{ fontFamily: 'var(--font-body), sans-serif' }}>
                    Presence as Rebellion
                  </span>
                </div>
              </div>
              <p className="text-base text-gray-400 mt-6" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '1.25rem' }}>
                Monthly recurring payment. Subscription-based.
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
            loading="lazy"
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
                    loading="lazy"
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
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <p className="text-gray-300">
                      Click on the button here
                    </p>
                    <div className="inline-block">
                      <div 
                        className="intercom-button-wrapper-faq"
                        style={{
                          background: 'linear-gradient(90deg, #FF00FF, #00FFFF)',
                          padding: '2px',
                          borderRadius: '50%',
                          boxShadow: '0 0 8px rgba(255, 0, 255, 0.4), 0 0 8px rgba(0, 255, 255, 0.4)',
                          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                          width: '56px',
                          height: '56px',
                          display: 'inline-block',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 0, 255, 0.6), 0 0 12px rgba(0, 255, 255, 0.6)';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 0, 255, 0.4), 0 0 8px rgba(0, 255, 255, 0.4)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onClick={() => {
                          try {
                            show();
                          } catch (error) {
                            console.error('Failed to open Intercom:', error);
                          }
                        }}
                      >
                        <button
                          className="flex items-center justify-center w-full h-full rounded-full cursor-pointer transition-all duration-300 group hover:bg-black/90 active:scale-95"
                          aria-label="Open chat"
                          style={{
                            fontFamily: 'var(--font-display), sans-serif',
                            boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
                            border: 'none',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(4px)',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 255, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 255, 0.1)';
                          }}
                        >
                          <svg
                            className="w-6 h-6 text-[#00FFFF] transition-all duration-300 group-hover:text-[#00CCFF] group-hover:scale-110 relative z-10"
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
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Or send us an email at support@wayfindercoaching.net
                  </p>
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
              loading="lazy"
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
              loading="lazy"
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
                loading="lazy"
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


