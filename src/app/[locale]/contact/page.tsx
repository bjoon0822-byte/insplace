// 문의하기 페이지 — 서버 컴포넌트 (i18n 로드 후 클라이언트에 전달)
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import ContactForm from './ContactForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return <ContactForm messages={messages} />;
}
