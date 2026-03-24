import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      background: '#FFFFFF',
      color: '#0a0a0a',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#E5E5E5', fontFamily: "'Outfit', sans-serif" }}>
        404
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '16px', letterSpacing: '-0.02em' }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{ fontSize: '0.9375rem', color: '#737373', marginTop: '8px', maxWidth: '400px' }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/ko"
        style={{
          marginTop: '32px',
          padding: '12px 32px',
          background: '#D97706',
          color: '#FFFFFF',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
