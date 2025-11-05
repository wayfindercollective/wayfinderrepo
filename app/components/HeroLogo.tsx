'use client';

import Image from 'next/image';

export default function HeroLogo() {
  return (
    <div className="relative w-fit mx-auto group">
      <Image
        src="/Master_Logo.jpg"
        alt="Void Underground"
        width={1800}
        height={400}
        priority
        className="block select-none pointer-events-none"
      />

      {/* underline locked to UNDERGROUND */}
      <span
        aria-hidden
        className="
          absolute left-1/2 -translate-x-1/2
          bottom-[36%]           /* move up under the word */
          w-[84%] h-[6px]        /* match word width and thickness */
          rounded-full bg-[#0FF]
          shadow-[0_0_12px_#0FF,0_0_26px_rgba(0,255,255,0.6)]
          transition-[width] duration-500 ease-out
          group-hover:w-[88%]
        "
      />
    </div>
  );
}
