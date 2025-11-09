import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for timers (IP -> end timestamp)
// In production, you'd want to use a database or Redis
const timers = new Map<string, number>();

// Timer duration in milliseconds (default: 24 hours)
const TIMER_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default (shouldn't happen in production)
  return 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Check if timer exists for this IP
    const endTime = timers.get(ip);
    const now = Date.now();
    
    if (!endTime || endTime <= now) {
      // No timer exists or timer has expired, create a new one
      const newEndTime = now + TIMER_DURATION;
      timers.set(ip, newEndTime);
      
      return NextResponse.json({
        remaining: TIMER_DURATION,
        endTime: newEndTime,
        isNew: true,
      });
    }
    
    // Timer exists and is still active
    const remaining = endTime - now;
    
    return NextResponse.json({
      remaining: Math.max(0, remaining),
      endTime: endTime,
      isNew: false,
    });
  } catch (error) {
    console.error('Timer API error:', error);
    return NextResponse.json(
      { error: 'Failed to get timer' },
      { status: 500 }
    );
  }
}

