"use client";

type Props = { className?: string };

export default function VoidWordmark({ className }: Props) {
  return (
    <div
      className={`relative inline-block w-full ${className || ""}`}
      aria-label="Void Underground"
    >
      {/* Master Logo */}
      <div className="relative w-full">
        {/* Using regular img tag to ensure visibility */}
        <img
          src="/Master_Logo.png"
          alt="Void Underground Logo"
          className="w-full h-auto block"
          style={{
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            maxWidth: '100%',
            height: 'auto',
            filter: 'contrast(1.4) brightness(1.15) saturate(1.2) drop-shadow(0 0 8px rgba(0, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(0, 255, 255, 0.7)) drop-shadow(0 0 24px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 32px rgba(0, 255, 255, 0.3))',
            WebkitFilter: 'contrast(1.4) brightness(1.15) saturate(1.2) drop-shadow(0 0 8px rgba(0, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(0, 255, 255, 0.7)) drop-shadow(0 0 24px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 32px rgba(0, 255, 255, 0.3))',
          }}
        />
      </div>
    </div>
  );
}
