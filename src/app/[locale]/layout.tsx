// [locale] 레이아웃 — Header/Footer 공통 래핑
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import { locales } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { AuthProvider } from '@/contexts/AuthContext';
import { QuoteProvider } from '@/contexts/QuoteContext';
import { ToastProvider } from '@/contexts/ToastContext';
import QuoteFAB from '@/components/ui/QuoteFAB';

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ooh-gray.vercel.app';

  const brandName = (messages.brand as Record<string, string>)?.name || 'InsPlace';
  const tagline = (messages.brand as Record<string, string>)?.tagline || '';
  const description = (messages.brand as Record<string, string>)?.description || '';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${brandName} — ${tagline}`,
      template: `%s | ${brandName}`,
    },
    description,
    keywords: ['K-POP', '팬 광고', '아이돌 생일', '지하철 광고', '옥외광고', 'OOH', '카페 대관', '굿즈 제작', 'fan ad', 'birthday ad'],
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : 'en_US',
      url: `${siteUrl}/${locale}`,
      siteName: brandName,
      title: `${brandName} — ${tagline}`,
      description,
      images: [{ url: '/images/hero-bg.webp', width: 1200, height: 630, alt: brandName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} — ${tagline}`,
      description,
      images: ['/images/hero-bg.webp'],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'ko': `${siteUrl}/ko`,
        'en': `${siteUrl}/en`,
        'ja': `${siteUrl}/ja`,
        'zh': `${siteUrl}/zh`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ooh-gray.vercel.app';
  const brandName = (messages.brand as Record<string, string>)?.name || 'InsPlace';
  const description = (messages.brand as Record<string, string>)?.description || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandName,
    url: siteUrl,
    logo: `${siteUrl}/images/hero-bg.webp`,
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Korean', 'English', 'Japanese', 'Chinese'],
    },
  };

  return (
    <AuthProvider>
      <QuoteProvider>
        <ToastProvider>
        <div lang={locale}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <CursorGlow />
          <Header locale={locale as Locale} messages={messages} />
          <main id="main-content" style={{ paddingTop: 'var(--header-height)' }}>
            {children}
          </main>
          <Footer locale={locale as Locale} messages={messages} />
          <QuoteFAB locale={locale as Locale} messages={messages} />
        </div>
        </ToastProvider>
      </QuoteProvider>
    </AuthProvider>
  );
}
