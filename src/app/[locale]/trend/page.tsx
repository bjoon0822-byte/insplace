// 트렌드 대시보드 — Premium Dashboard with Charts
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { celebTrend, adTrend, eventTrend, trendStats } from '@/data/trends';
import { FadeIn } from '@/components/ui/FadeIn';
import TrendDashboard from '@/components/trend/TrendDashboard';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrendPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  const labels = {
    celebRank: t(m, 'trend.celebRank'),
    adRank: t(m, 'trend.adRank'),
    eventRank: t(m, 'trend.eventRank'),
  };

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

      <TrendDashboard
        celebTrend={celebTrend}
        adTrend={adTrend}
        eventTrend={eventTrend}
        stats={trendStats}
        labels={labels}
        messages={m as Record<string, unknown>}
      />
    </>
  );
}
