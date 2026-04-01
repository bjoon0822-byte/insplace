'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TEXTS: Record<string, { title: string; desc: string; cta: string }> = {
  ko: { title: '페이지를 찾을 수 없습니다', desc: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.', cta: '홈으로 돌아가기' },
  en: { title: 'Page Not Found', desc: 'The page you requested does not exist or may have been moved.', cta: 'Go Home' },
  ja: { title: 'ページが見つかりません', desc: 'リクエストされたページは存在しないか、移動された可能性があります。', cta: 'ホームへ戻る' },
  zh: { title: '找不到页面', desc: '您请求的页面不存在或已被移动。', cta: '返回首页' },
};

export default function LocaleNotFound() {
  const pathname = usePathname();
  const match = pathname.match(/^\/(ko|en|ja|zh)/);
  const locale = match ? match[1] : 'ko';
  const txt = TEXTS[locale] || TEXTS.ko;

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
        {txt.title}
      </h1>
      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--gray-500)',
        marginTop: '8px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {txt.desc}
      </p>
      <Link
        href={`/${locale}`}
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
        {txt.cta}
      </Link>
    </div>
  );
}
