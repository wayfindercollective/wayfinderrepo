import { NextRequest, NextResponse } from 'next/server';

// Phase definitions
// CST is UTC-6, so 9 AM CST = 3 PM UTC (15:00 UTC)
const PHASES = {
  II: {
    endTime: new Date('2025-11-20T15:00:00Z').getTime(), // November 20, 2025 9 AM CST
    nextPhase: 'III' as const,
  },
  III: {
    endTime: new Date('2025-11-23T15:00:00Z').getTime(), // November 23, 2025 9 AM CST
    nextPhase: null,
  },
};

// Determine current phase based on time
function getCurrentPhase(): { phase: 'II' | 'III'; endTime: number; nextPhase: 'III' | null } {
  const now = Date.now();
  
  // Check Phase II
  if (now < PHASES.II.endTime) {
    return {
      phase: 'II',
      endTime: PHASES.II.endTime,
      nextPhase: PHASES.II.nextPhase,
    };
  }
  
  // Check Phase III
  if (now < PHASES.III.endTime) {
    return {
      phase: 'III',
      endTime: PHASES.III.endTime,
      nextPhase: PHASES.III.nextPhase,
    };
  }
  
  // Default to Phase II if all phases expired (shouldn't happen in normal flow)
  return {
    phase: 'II',
    endTime: PHASES.II.endTime,
    nextPhase: PHASES.II.nextPhase,
  };
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const { phase, endTime, nextPhase } = getCurrentPhase();
    const remaining = Math.max(0, endTime - now);
    
    return NextResponse.json({
      remaining: remaining,
      endTime: endTime,
      phase: phase,
      nextPhase: nextPhase,
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

