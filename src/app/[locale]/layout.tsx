// [locale] 레이아웃 — Header/Footer 공통 래핑
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import { locales } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { AuthProvider } from '@/contexts/AuthContext';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  const brandName = (messages.brand as Record<string, string>)?.name || 'InsPlace';
  const tagline = (messages.brand as Record<string, string>)?.tagline || '';

  return {
    title: `${brandName} — ${tagline}`,
    description: (messages.brand as Record<string, string>)?.description || '',
    alternates: {
      languages: {
        'ko': '/ko',
        'en': '/en',
        'ja': '/ja',
        'zh': '/zh',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  // html lang 속성을 locale에 맞게 설정
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }

  return (
    <AuthProvider>
      <div lang={locale}>
        <CursorGlow />
        <Header locale={locale as Locale} messages={messages} />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          {children}
        </main>
        <Footer locale={locale as Locale} messages={messages} />
      </div>
    </AuthProvider>
  );
}
