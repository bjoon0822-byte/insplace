export default function LocaleLoading() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 24px 80px',
    }}>
      {/* Hero skeleton */}
      <div style={{
        height: '240px',
        borderRadius: '24px',
        background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-50) 50%, var(--gray-100) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        marginBottom: '48px',
      }} />

      {/* Content skeleton rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            height: '200px',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-50) 50%, var(--gray-100) 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.5s infinite ${i * 0.15}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
