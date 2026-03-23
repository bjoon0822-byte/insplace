// 커뮤니티 게시판 — 서버 컴포넌트
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import { t } from '@/i18n/request';
import CommunityBoard from './CommunityBoard';
import styles from '../subpage.module.css';

interface CommunityPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>COMMUNITY.</span>
        <div className={styles.pageHeroInner}>
          <span className={styles.pageEyebrow}>COMMUNITY</span>
          <h1 className={styles.pageTitle}>{t(messages, 'community.title')}</h1>
          <p className={styles.pageSubtitle}>{t(messages, 'community.subtitle')}</p>
        </div>
      </section>

      <CommunityBoard locale={locale as Locale} messages={messages} />
    </>
  );
}
