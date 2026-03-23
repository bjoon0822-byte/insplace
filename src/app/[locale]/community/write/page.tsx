// 글쓰기 — 서버 컴포넌트
import { Locale } from '@/types';
import { getMessages } from '@/i18n/request';
import { t } from '@/i18n/request';
import WritePost from './WritePost';
import styles from '../../subpage.module.css';

interface WritePageProps {
  params: Promise<{ locale: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as Locale);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>WRITE.</span>
        <div className={styles.pageHeroInner}>
          <span className={styles.pageEyebrow}>NEW POST</span>
          <h1 className={styles.pageTitle}>{t(messages, 'community.writePost')}</h1>
        </div>
      </section>

      <WritePost locale={locale as Locale} messages={messages} />
    </>
  );
}
