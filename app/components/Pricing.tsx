import Price from "./Price";

export default function Pricing() {
  return (
    <div className="mt-6 md:mt-3 max-w-lg mx-auto text-center">
      {/* Branded price block */}
      <div className="mt-3 md:mt-2">
        <Price />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:mt-3" style={{ alignItems: 'center', alignContent: 'center' }}>
        <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
          <a
            id="pricing-enroll"
            href="https://bookmyeventnow.com/register?a=new&p=32"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-void mt-4 inline-block"
            style={{ fontSize: '1.15rem', padding: '16px 28px' }}
          >
            ENTER THE VOID
          </a>
          <span className="text-xs md:text-sm mt-2 block text-center presence-rebellion-flash" style={{ color: 'var(--voidMagenta)', fontFamily: 'var(--font-body), sans-serif' }}>
            Presence as Rebellion
          </span>
        </div>
      </div>
    </div>
  );
}
