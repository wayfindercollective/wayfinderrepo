'use client';

import Image from 'next/image';
import Starfield from './Starfield';

export default function HeroLogo() {
  return (
    <section className="relative text-white overflow-visible bg-transparent">
      {/* starfield behind everything */}
      <div className="absolute inset-0 -z-10">
        <Starfield />
      </div>

      {/* logo plus cyan underline */}
      <div className="relative w-fit mx-auto -mt-4 group z-10" style={{ transform: 'scale(0.75)' }}>
        <Image
          src="/Master_Logo.png?v=2"
          alt="Void Underground"
          width={1800}
          height={400}
          priority
          unoptimized
          className="block select-none pointer-events-none"
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
          style={{ top: '60%' }}   // nudge this 58 to 62 until it kisses the word
        />
      </div>
    </section>
  );
}
