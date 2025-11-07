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
  const [showWeekPackOverlay, setShowWeekPackOverlay] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
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
              Reality is broken. <span className="emphasis-word">Charisma</span> bends it.
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 mb-6 max-w-2xl mx-auto -mt-1">
              A private dojo for presence under fire. Weekly drills. Live labs. Field ops. You do not binge. You install.
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
                <h3 className="text-xl font-bold mb-4">Founders Annual Pass</h3>
                <p>
                  Twelve months inside the dojo. Weekly doctrine. Drills. Field missions. Live labs. Clear wins tracked.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="fade">
              <div className="cardVoid p-8">
                <h3 className="text-xl font-bold mb-4">Community that trains</h3>
                <p>
                  Operators who post reps and after action notes. Feedback that builds presence. Proof over talk.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-xl font-bold mb-4">Credit for live training</h3>
                <p>
                  $500 credit toward a Jeffy Bootcamp in 2025-2026.
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
                    WeekPack engine
                  </h3>
                  <p className="text-lg">
                    Every week you get a doctrine card, a short home drill, a real world mission, and a live lab.
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
                    KSIs we track
                  </h3>
                  <p className="text-lg">
                    State control. Nonverbals. Attention leadership. Calibration. Decisiveness. Spontaneity.
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
                    Sample drills
                  </h3>
                  <p className="text-lg">
                    Breath weight eyes baseline. Three beat silence. Spike then sincere pivot. Empathy to plow recovery.
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
                    Reset ritual
                  </h3>
                  <p className="text-lg">
                    End of week check that locks gains and sets the next mission.
                  </p>
                </div>
              </AnimatedColumn>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setShowWeekPackOverlay(true)}
              className="text-cyan-400 hover:text-cyan-300 underline"
              style={{ fontSize: '300%' }}
            >
              See a WeekPack
            </button>
          </div>
        </div>
      </section>

      {/* WeekPack Overlay */}
      {showWeekPackOverlay && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowWeekPackOverlay(false)}
        >
          <div 
            className="bg-gray-900 border border-cyan-500 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Sample WeekPack</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Doctrine card: Frame in a dying empire</li>
              <li>• Home drill: Three beat silence</li>
              <li>• Field mission: Attention leadership at coffee shop</li>
              <li>• Live lab: State control under pressure</li>
              <li>• Reset ritual: Lock gains and set next mission</li>
            </ul>
            <button
              onClick={() => setShowWeekPackOverlay(false)}
              className="mt-6 text-cyan-400 hover:text-cyan-300 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
                <h3 className="text-2xl font-bold mb-4">Action over theory</h3>
                <p>
                  You train state first. Information emerges from embodiment.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Bootcamp precision</h3>
                <p>
                  Field tested drills turned into a repeatable system without losing the heat.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="left">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Myth and map</h3>
                <p>
                  Presence over Persona. Controlled Madness. Frame in a dying empire.
                </p>
              </div>
            </AnimatedColumn>
            <AnimatedColumn direction="right">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4">Receipts and ethics</h3>
                <p>
                  Decades of live proof. Consent forward leadership. Zero manipulation.
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
                <div className="text-gray-300 mt-1" style={{ fontSize: '200%' }}>
                  Founders Annual Pass
                </div>
                <div className="text-lg text-gray-300 mt-2">
                  Includes $500 credit for a Jeffy Bootcamp in 2025-2026.
                </div>
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
                  <span>Twelve months of premium content</span>
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
                  <span>Access to missions and labs</span>
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
                  <span>Action oriented tasks and exercises</span>
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
                className="btn-void w-full sm:w-auto"
              >
                Join the Void
              </a>
              <p className="text-sm text-gray-400 mt-6">
                One time payment for twelve months of access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="voidSection relative z-10">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <AnimatedSectionTitle className="text-4xl sm:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleCyan">
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
                FAQ
              </span>
            </AnimatedSectionTitle>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-xl font-bold">Is this a course</h3>
                <span className="text-2xl">{openFAQ === 0 ? '−' : '+'}</span>
              </button>
              {openFAQ === 0 && (
                <p className="mt-4 text-gray-300">
                  No. It is a dojo with weekly training and clear KSIs that show change.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-xl font-bold">Do I need nightlife</h3>
                <span className="text-2xl">{openFAQ === 1 ? '−' : '+'}</span>
              </button>
              {openFAQ === 1 && (
                <p className="mt-4 text-gray-300">
                  No. Day missions and labs cover all contexts.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-xl font-bold">Is this pickup</h3>
                <span className="text-2xl">{openFAQ === 2 ? '−' : '+'}</span>
              </button>
              {openFAQ === 2 && (
                <p className="mt-4 text-gray-300">
                  No. It is consent forward charisma for dating, business, and leadership.
                </p>
              )}
            </div>
            <div className="cardVoid p-6">
              <button
                onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                className="w-full text-left flex items-center justify-between"
              >
                <h3 className="text-xl font-bold">What changes in thirty days</h3>
                <span className="text-2xl">{openFAQ === 3 ? '−' : '+'}</span>
              </button>
              {openFAQ === 3 && (
                <p className="mt-4 text-gray-300">
                  A louder baseline broadcast. Fewer freezes. Cleaner recovery under pressure.
                </p>
              )}
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
