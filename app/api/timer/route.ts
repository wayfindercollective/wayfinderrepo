import { NextRequest, NextResponse } from 'next/server';

// Fixed end date: Monday, November 17th, 2025 at 9 AM CST
// CST is UTC-6, so 9 AM CST = 3 PM UTC (15:00 UTC)
// Date: November 17, 2025 15:00:00 UTC
const FIXED_END_TIME = new Date('2025-11-17T15:00:00Z').getTime();

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const remaining = Math.max(0, FIXED_END_TIME - now);
    
    return NextResponse.json({
      remaining: remaining,
      endTime: FIXED_END_TIME,
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

