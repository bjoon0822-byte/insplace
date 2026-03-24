import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import { locales } from '@/i18n/routing';
import AdminDashboard from './AdminDashboard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  return { title: 'Admin Dashboard', robots: { index: false, follow: false } };
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return <AdminDashboard locale={locale as Locale} messages={messages} />;
}
