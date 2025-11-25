import { NextRequest, NextResponse } from 'next/server';

// Phase definitions
// CST is UTC-6, so 9 AM CST = 3 PM UTC (15:00 UTC)
const PHASES = {
  IV: {
    endTime: new Date('2025-11-26T15:00:00Z').getTime(), // November 26, 2025 9 AM CST
    nextPhase: 'V' as const,
  },
  V: {
    endTime: new Date('2025-11-29T15:00:00Z').getTime(), // November 29, 2025 9 AM CST
    nextPhase: null,
  },
};

// Determine current phase based on time
function getCurrentPhase(): { phase: 'IV' | 'V'; endTime: number; nextPhase: 'V' | null } {
  const now = Date.now();
  
  // Check Phase IV
  if (now < PHASES.IV.endTime) {
    return {
      phase: 'IV',
      endTime: PHASES.IV.endTime,
      nextPhase: PHASES.IV.nextPhase,
    };
  }
  
  // Check Phase V
  if (now < PHASES.V.endTime) {
    return {
      phase: 'V',
      endTime: PHASES.V.endTime,
      nextPhase: PHASES.V.nextPhase,
    };
  }
  
  // Default to Phase V if expired (still show Phase V)
  return {
    phase: 'V',
    endTime: PHASES.V.endTime,
    nextPhase: PHASES.V.nextPhase,
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

