// 광고 상품 리스트 페이지 — 서버 컴포넌트 (i18n 로드 후 클라이언트에 전달)
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import AdListContent from './AdListContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdListPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return <AdListContent locale={locale as Locale} messages={messages} />;
}
