'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSectionTitle({ children, className = '' }: AnimatedSectionTitleProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <h2
      ref={elementRef}
      className={`${className} ${isVisible ? 'animate-line' : ''}`}
    >
      {children}
    </h2>
  );
}
