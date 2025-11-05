'use client';

import Image from 'next/image';

export default function HeroLogo() {
  return (
    <div className="relative group inline-block">
      {/* Let the stars show through the JPG by blending away the black */}
      <Image
        src="/Master_Logo.jpg"
        alt="Void Underground"
        width={1600}
        height={600}
        priority
        className="mx-auto w-[min(90vw,1100px)] h-auto mix-blend-screen pointer-events-none select-none"
      />

      {/* Cyan underline under UNDERGROUND (animates on hover) */}
      <span
        aria-hidden
        className="
          absolute left-1/2 -translate-x-1/2 bottom-[15%]
          h-[6px] w-0 rounded-full bg-[#0FF]
          shadow-[0_0_12px_#0FF,0_0_24px_rgba(0,255,255,0.6)]
          transition-[width] duration-500 ease-out
          group-hover:w-[42%]
        "
      />
    </div>
  );
}
