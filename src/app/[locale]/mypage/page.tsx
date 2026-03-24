import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { locales } from '@/i18n/routing';
import MyPageContent from './MyPageContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: t(m, 'mypage.title'),
  };
}

export default async function MyPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  return <MyPageContent locale={locale as Locale} messages={m} />;
}
