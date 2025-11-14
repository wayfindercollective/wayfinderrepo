import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const alt = 'Void Underground Logo';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export async function GET() {
  try {
    // Read the logo image file
    const logoPath = join(process.cwd(), 'public', 'VU_LOGO_V2.png');
    const logoBuffer = await readFile(logoPath);
    
    // Resize logo to fit nicely (90% of width, maintaining aspect ratio)
    const maxWidth = Math.floor(1200 * 0.9); // 90% of canvas width
    const maxHeight = Math.floor(630 * 0.9); // 90% of canvas height
    
    const logoResized = await sharp(logoBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();

    // Use Sharp to composite the resized logo onto a black background
    const compositeImage = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }, // Pure black background
      },
    })
      .composite([
        {
          input: logoResized,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer();

    return new Response(compositeImage, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Fallback to text-based version using ImageResponse
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
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              marginBottom: 20,
              fontFamily: 'system-ui',
            }}
          >
            Join the Void
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#00FFFF',
              fontFamily: 'system-ui',
            }}
          >
            A Cyber-Monk Dojo for Real-World Charisma
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}

