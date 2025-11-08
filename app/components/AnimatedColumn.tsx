'use client';

import { useColumnScrollAnimation } from '../hooks/useColumnScrollAnimation';

interface AnimatedColumnProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | 'fade';
  className?: string;
  onHover?: () => void;
}

export default function AnimatedColumn({ children, direction, className = '', onHover }: AnimatedColumnProps) {
  const { elementRef, isVisible } = useColumnScrollAnimation();

  const getAnimationClass = () => {
    switch (direction) {
      case 'left':
        return `column-animate-left ${isVisible ? 'visible' : ''}`;
      case 'right':
        return `column-animate-right ${isVisible ? 'visible' : ''}`;
      case 'fade':
        return `column-animate-fade ${isVisible ? 'visible' : ''}`;
      default:
        return '';
    }
  };

  const handleMouseEnter = () => {
    if (onHover) {
      onHover();
    }
  };

  return (
    <div 
      ref={elementRef} 
      className={`${getAnimationClass()} ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  );
}
