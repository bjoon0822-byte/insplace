'use client';

import { useState } from 'react';

/**
 * SplineScene — 풀스크린 인터랙티브 3D 배경을 위한 iframe 컴포넌트
 */
interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function SplineScene({
  sceneUrl,
  className = '',
  width = '100%',
  height = '100%',
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'auto', // 3D 인터랙션 허용
      }}
    >
      {/* 백그라운드 로딩 플레이스홀더 (3D 뷰어가 뜨기 전까지 보임) */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
          }}
        >
          <div style={{ color: '#9CA3AF', letterSpacing: '0.2em', fontSize: '0.875rem' }}>
            LOADING 3D EXPERIENCE...
          </div>
        </div>
      )}

      {/* iframe — 3D 씬 로드 */}
      <iframe
        src={sceneUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
        allow="autoplay"
        loading="lazy"
        title="Spline 3D Hero Background"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Spline 무료 플랜 사용 시 워터마크는 유료 플랜으로 제거하세요 */}
    </div>
  );
}
