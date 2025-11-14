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
export const contentType = 'image/jpeg';

export async function GET() {
  try {
    // Read the preview logo image file
    const logoPath = join(process.cwd(), 'public', 'PreviewLogo.jpg');
    const logoBuffer = await readFile(logoPath);
    
    // Resize the preview logo to fit the Open Graph dimensions (1200x630)
    // Using 'cover' to fill the entire area while maintaining aspect ratio
    const compositeImage = await sharp(logoBuffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convert Buffer to Uint8Array for Response compatibility
    const imageArray = new Uint8Array(compositeImage);

    return new Response(imageArray, {
      headers: {
        'Content-Type': 'image/jpeg',
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

