'use client';

import { useEffect } from 'react';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[InsPlace Error]', error);
  }, [error]);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '120px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 24px',
        borderRadius: '50%',
        background: 'var(--accent-light, rgba(217, 119, 6, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #D97706)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'var(--gray-900)',
        letterSpacing: '-0.02em',
      }}>
        문제가 발생했습니다
      </h1>
      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--gray-500)',
        marginTop: '8px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: '32px',
          padding: '12px 32px',
          background: 'var(--accent, #D97706)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-full, 999px)',
          fontWeight: 700,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
