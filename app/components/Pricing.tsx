'use client';

interface PricingProps {
  handleColumnHover: () => void;
}

export default function Pricing({ handleColumnHover }: PricingProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-0 relative">
        {/* Divider line in the middle - matching Initiation Package style */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2" 
          style={{ 
            width: '2px',
            background: 'linear-gradient(180deg, #ff00ff, #00ffff)',
            boxShadow: '0 0 8px rgba(255,0,255,0.6), 0 0 8px rgba(0,255,255,0.6)',
            opacity: 1,
            zIndex: 5
          }}
        ></div>
        
        {/* Annual Pass - Left */}
        <div className="text-center relative flex flex-col" style={{ paddingRight: 'clamp(16px, 2vw, 1px)', marginRight: 'clamp(-16px, -2vw, -1px)' }} onMouseEnter={handleColumnHover}>
          <div className="mb-2 md:mb-3 flex-1" style={{ fontSize: 'clamp(110%, 4vw, 135%)', minHeight: 'clamp(120px, 15vw, 150px)' }}>
            <div className="mb-1 md:mb-2 relative inline-block">
              <span className="current-price-wrapper relative inline-block">
                <span className="current-price">
                  $499
                </span>
                {/* Crossed out price positioned as extension above and to the right */}
                <div className="absolute hidden md:block" style={{ 
                  top: '-50px',
                  right: '-30px',
                  transform: 'rotate(25deg)',
                  transformOrigin: 'bottom left',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  <span style={{ 
                    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                    color: '#ffffff',
                    textDecoration: 'line-through',
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 400,
                    display: 'block',
                    opacity: 0.8
                  }}>
                    $900
                  </span>
                  <div style={{ 
                    fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 400,
                    marginTop: '1px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    opacity: 0.8
                  }}>
                    total value
                  </div>
                </div>
                {/* Mobile version - positioned differently */}
                <div className="absolute md:hidden" style={{ 
                  top: '-30px',
                  right: '-12px',
                  transform: 'rotate(25deg)',
                  transformOrigin: 'bottom left',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  <span style={{ 
                    fontSize: 'clamp(0.625rem, 1.5625vw, 0.9375rem)',
                    color: '#ffffff',
                    textDecoration: 'line-through',
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 400,
                    display: 'block',
                    opacity: 0.8
                  }}>
                    $900
                  </span>
                  <div style={{ 
                    fontSize: 'clamp(0.375rem, 0.9375vw, 0.46875rem)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display), sans-serif',
                    fontWeight: 400,
                    marginTop: '1px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    opacity: 0.8
                  }}>
                    total value
                  </div>
                </div>
              </span>
            </div>
            <div className="text-gray-300 mt-1" style={{ fontSize: 'clamp(140%, 5vw, 180%)', fontFamily: 'var(--font-display), sans-serif', letterSpacing: '0.02em', fontWeight: 700 }}>
                Annual Pass
            </div>
          </div>
          <div className="mb-3 md:mb-4 text-center space-y-1" style={{ marginTop: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
            <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', color: '#999', fontFamily: 'var(--font-mono), monospace' }}>
              +300 credits for Jeff's bootcamp
            </div>
            <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', color: '#999', fontFamily: 'var(--font-mono), monospace' }}>
              2 months access <span style={{ textTransform: 'uppercase' }}>FREE</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mt-2 md:mt-3">
            <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
              <a
                id="pricing-enroll-annual"
                href="https://bookmyeventnow.com/register?a=new&p=38"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-void mt-3 md:mt-4 uppercase tracking-[0.1em] inline-block"
                style={{ 
                  fontSize: 'clamp(0.9rem, 3vw, 1.15rem)', 
                  padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 28px)', 
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
              <span className="text-xs md:text-sm mt-2 block text-center presence-rebellion-flash" style={{ fontFamily: 'var(--font-body), sans-serif', color: '#00FFFF' }}>
                Presence as Rebellion
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Pass - Right */}
        <div className="text-center flex flex-col" style={{ paddingLeft: 'clamp(16px, 2vw, 1px)', marginLeft: 'clamp(-16px, -2vw, -1px)' }} onMouseEnter={handleColumnHover}>
          <div className="mb-4 md:mb-6 flex-1" style={{ fontSize: 'clamp(110%, 4vw, 135%)', minHeight: 'clamp(120px, 15vw, 150px)' }}>
            <div className="mb-1 md:mb-2">
              <span className="current-price-wrapper">
                <span className="current-price" style={{ 
                  color: '#000000',
                  WebkitTextStroke: '2px #CC00CC',
                  textShadow: '0 0 10px rgba(204, 0, 204, 0.8), 0 0 20px rgba(204, 0, 204, 0.6), 0 0 30px rgba(204, 0, 204, 0.4), 0 0 40px rgba(204, 0, 204, 0.2)'
                } as React.CSSProperties}>
                  $50
                </span>
              </span>
            </div>
            <div className="text-gray-300 mt-1" style={{ fontSize: 'clamp(140%, 5vw, 180%)', fontFamily: 'var(--font-display), sans-serif', letterSpacing: '0.02em', fontWeight: 700 }}>
              Monthly Pass
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mt-2 md:mt-3">
            <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
              <a
                id="pricing-enroll-monthly"
                href="https://bookmyeventnow.com/register?a=new&p=33"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-void btn-void-magenta mt-3 md:mt-4 uppercase tracking-[0.1em] inline-block"
                style={{ 
                  fontSize: 'clamp(0.9rem, 3vw, 1.15rem)', 
                  padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 28px)', 
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
              <span className="text-xs md:text-sm mt-2 block text-center presence-rebellion-flash" style={{ fontFamily: 'var(--font-body), sans-serif', color: '#CC00CC' }}>
                Presence as Rebellion
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
