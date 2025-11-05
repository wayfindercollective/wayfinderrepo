'use client';

import Image from 'next/image';
import './hero-logo.css';

export default function HeroLogo() {
  return (
    <div className="heroLogo">
      {/* Logo image */}
      <Image
        src="/signal-core.jpg"   // put your master logo at public/signal-core.jpg
        alt="Void Underground"
        width={1600}
        height={1600}
        priority
        className="logoImg"
      />

      {/* Cyan underline under UNDERGROUND */}
      <div className="cyanBar" aria-hidden="true" />

      {/* Orbiting cyan dots overlay */}
      <div className="orbit" aria-hidden="true">
        <div className="orbitInner">
          <span className="orbitDot" style={{ ['--a' as any]:'0deg'   }} />
          <span className="orbitDot" style={{ ['--a' as any]:'45deg'  }} />
          <span className="orbitDot" style={{ ['--a' as any]:'90deg'  }} />
          <span className="orbitDot" style={{ ['--a' as any]:'135deg' }} />
          <span className="orbitDot" style={{ ['--a' as any]:'180deg' }} />
          <span className="orbitDot" style={{ ['--a' as any]:'225deg' }} />
          <span className="orbitDot" style={{ ['--a' as any]:'270deg' }} />
          <span className="orbitDot" style={{ ['--a' as any]:'315deg' }} />
        </div>
      </div>
    </div>
  );
}
