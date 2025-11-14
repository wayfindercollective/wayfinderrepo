import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Void Underground Logo';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
            fontFamily: 'system-ui',
            letterSpacing: '-0.02em',
          }}
        >
          Join the Void
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#00FFFF',
            fontFamily: 'system-ui',
            marginTop: 10,
          }}
        >
          A Cyber-Monk Dojo for Real-World Charisma
        </div>
        {/* Domain */}
        <div
          style={{
            fontSize: 24,
            color: '#FFFFFF',
            opacity: 0.7,
            marginTop: 40,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
          }}
        >
          THEVOIDUNDERGROUND.COM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

