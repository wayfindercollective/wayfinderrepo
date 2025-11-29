import { NextRequest, NextResponse } from 'next/server';

// Final Phase countdown
// PST is UTC-8, so 11:59 PM PST on November 30, 2025 = December 1, 2025 07:59 AM UTC
const LAST_PHASE_END_TIME = new Date('2025-12-01T07:59:00Z').getTime(); // November 30, 2025 11:59 PM PST

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const remaining = Math.max(0, LAST_PHASE_END_TIME - now);
    
    return NextResponse.json({
      remaining: remaining,
      endTime: LAST_PHASE_END_TIME,
      phase: 'II' as const,
      nextPhase: null,
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
