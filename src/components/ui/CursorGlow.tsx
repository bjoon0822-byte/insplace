'use client';

import { useEffect, useState } from 'react';

/** 마우스를 따라다니는 그라데이션 글로우 (데스크톱 전용) */
export function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 터치 디바이스에서는 비활성화
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) {
      setIsTouchDevice(true);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192, 132, 252, 0.1) 0%, rgba(244, 114, 182, 0.05) 40%, rgba(255,255,255,0) 70%)',
        filter: 'blur(40px)',
        transform: `translate(${position.x - 250}px, ${position.y - 250}px)`,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.5s ease',
        willChange: 'transform',
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
