import { NextRequest, NextResponse } from 'next/server';

// Phase definitions
// PST is UTC-8
const PHASES = {
  BLACK_FRIDAY: {
    endTime: new Date('2025-12-01T07:59:00Z').getTime(), // November 30, 2025 11:59 PM PST
    nextPhase: 'CYBER_MONDAY' as const,
  },
  CYBER_MONDAY: {
    endTime: new Date('2025-12-02T07:59:00Z').getTime(), // December 1, 2025 11:59 PM PST (Cyber Monday)
    nextPhase: null,
  },
};

// Determine current phase based on time
function getCurrentPhase(): { phase: 'BLACK_FRIDAY' | 'CYBER_MONDAY'; endTime: number; nextPhase: 'CYBER_MONDAY' | null } {
  const now = Date.now();
  
  // Check Black Friday phase
  if (now < PHASES.BLACK_FRIDAY.endTime) {
    return {
      phase: 'BLACK_FRIDAY',
      endTime: PHASES.BLACK_FRIDAY.endTime,
      nextPhase: PHASES.BLACK_FRIDAY.nextPhase,
    };
  }
  
  // Check Cyber Monday phase
  if (now < PHASES.CYBER_MONDAY.endTime) {
    return {
      phase: 'CYBER_MONDAY',
      endTime: PHASES.CYBER_MONDAY.endTime,
      nextPhase: PHASES.CYBER_MONDAY.nextPhase,
    };
  }
  
  // Default to Cyber Monday if expired
  return {
    phase: 'CYBER_MONDAY',
    endTime: PHASES.CYBER_MONDAY.endTime,
    nextPhase: PHASES.CYBER_MONDAY.nextPhase,
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
