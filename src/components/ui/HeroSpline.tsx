'use client';

import dynamic from 'next/dynamic';

/**
 * HeroSpline — 서버 컴포넌트(page.tsx)에서 안전하게 사용할 수 있는
 * Spline 3D 클라이언트 래퍼.
 * 
 * 'use client' → dynamic import (ssr: false) → SplineScene 순서로
 * 서버/클라이언트 경계를 깔끔하게 분리합니다.
 */
const SplineScene = dynamic(() => import('@/components/ui/SplineScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, rgba(250,250,250,1) 0%, rgba(243,244,246,1) 100%)',
      borderRadius: '32px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid #E5E7EB',
        borderTopColor: '#A855F7',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  ),
});

interface HeroSplineProps {
  sceneUrl: string;
  className?: string;
}

export default function HeroSpline({ sceneUrl, className }: HeroSplineProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <SplineScene sceneUrl={sceneUrl} width="100%" height="100%" />
    </div>
  );
}
