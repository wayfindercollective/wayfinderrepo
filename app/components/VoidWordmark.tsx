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
          }}
        />
      </div>
    </div>
  );
}
