import Link from 'next/link';

export default function LocaleNotFound() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '120px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '5rem',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: 'var(--gray-200)',
        fontFamily: 'var(--font-display)',
      }}>
        404
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'var(--gray-900)',
        marginTop: '16px',
        letterSpacing: '-0.02em',
      }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--gray-500)',
        marginTop: '8px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/ko"
        style={{
          display: 'inline-flex',
          marginTop: '32px',
          padding: '12px 32px',
          background: 'var(--accent)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          fontSize: '0.875rem',
          textDecoration: 'none',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
