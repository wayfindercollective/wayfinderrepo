'use client';

import { useAlternatingSlideAnimation } from '@/app/hooks/useAlternatingSlideAnimation';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  direction: 'left' | 'right';
  className?: string;
}

export function AnimatedCard({ children, direction, className = '' }: AnimatedCardProps) {
  const { elementRef } = useAlternatingSlideAnimation({
    direction,
    offset: 20, // 20px offset (between 16-24px)
    duration: 600,
  });

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
