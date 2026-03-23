// 트렌드 랭킹 — Supanova Design
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { celebTrend, adTrend, eventTrend } from '@/data/trends';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrendPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  function getTrendName(id: string, type: 'celeb' | 'station', fallback: string): string {
    return (m as any).trendData?.[type]?.[id] || fallback;
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>TREND.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>TRENDING NOW</span>
            <h1 className={styles.pageTitle}>{t(m, 'trend.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'trend.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.trendContainer}>
        <div className={styles.trendGrid}>
          <FadeIn delay={0} direction="up">
            <div className={styles.trendCard}>
              <h3 className={styles.trendCardTitle}>{t(m, 'trend.celebRank')}</h3>
              {celebTrend.map((item) => (
                <div key={item.rank} className={styles.trendItem}>
                  <span className={`${styles.trendRank} ${item.rank <= 3 ? styles.top : ''}`}>
                    {item.rank}
                  </span>
                  <span className={styles.trendName}>{getTrendName(item.id, 'celeb', item.name)}</span>
                  <span className={styles.trendCount}>{item.count}</span>
                  <span className={`${styles.trendChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : ''}`}>
                    {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08} direction="up">
            <div className={styles.trendCard}>
              <h3 className={styles.trendCardTitle}>{t(m, 'trend.adRank')}</h3>
              {adTrend.map((item) => (
                <div key={item.rank} className={styles.trendItem}>
                  <span className={`${styles.trendRank} ${item.rank <= 3 ? styles.top : ''}`}>
                    {item.rank}
                  </span>
                  <span className={styles.trendName}>{getTrendName(item.id, 'station', item.name)}</span>
                  <span className={styles.trendCount}>{item.count}건</span>
                  <span className={`${styles.trendChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : ''}`}>
                    {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.16} direction="up">
            <div className={styles.trendCard}>
              <h3 className={styles.trendCardTitle}>{t(m, 'trend.eventRank')}</h3>
              {eventTrend.map((item) => (
                <div key={item.rank} className={styles.trendItem}>
                  <span className={`${styles.trendRank} ${item.rank <= 3 ? styles.top : ''}`}>
                    {item.rank}
                  </span>
                  <span className={styles.trendName}>{getTrendName(item.id, 'celeb', item.name)}</span>
                  <span className={styles.trendCount}>{item.count}건</span>
                  <span className={`${styles.trendChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : ''}`}>
                    {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
