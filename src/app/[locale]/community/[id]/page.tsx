// 게시글 상세 — 서버 컴포넌트
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import PostDetail from './PostDetail';

interface PostPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, id } = await params;
  const messages = await getMessages(locale as Locale);

  return <PostDetail postId={id} locale={locale as Locale} messages={messages} />;
}
