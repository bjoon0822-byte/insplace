// 생일 캘린더 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { artists } from '@/data/artists';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';
import cal from './calendar.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }];
}

const MONTH_NAMES_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default async function CalendarPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  // Group artists by birthday month
  const byMonth = new Map<number, typeof artists>();
  for (const artist of artists) {
    const month = parseInt(artist.birthday.split('-')[0], 10);
    const arr = byMonth.get(month) || [];
    arr.push(artist);
    byMonth.set(month, arr);
  }

  // Sort each month's artists by day
  for (const [, arr] of byMonth) {
    arr.sort((a, b) => parseInt(a.birthday.split('-')[1]) - parseInt(b.birthday.split('-')[1]));
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>CALENDAR.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>BIRTHDAY CALENDAR</span>
            <h1 className={styles.pageTitle}>{t(m, 'calendar.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'calendar.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <div className={cal.calendarGrid}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const monthArtists = byMonth.get(month) || [];
            const isCurrent = month === currentMonth;

            return (
              <FadeIn key={month} delay={month * 0.03} direction="up">
                <div className={isCurrent ? cal.monthCardCurrent : cal.monthCard}>
                  <div className={cal.monthHeader}>
                    <h3 className={isCurrent ? cal.monthNameCurrent : cal.monthName}>
                      {MONTH_NAMES_KO[month - 1]}
                    </h3>
                    {isCurrent && (
                      <span className={cal.currentBadge}>
                        {t(m, 'calendar.thisMonth')}
                      </span>
                    )}
                  </div>

                  {monthArtists.length === 0 ? (
                    <p className={cal.monthEmpty}>
                      {t(m, 'calendar.noEvents')}
                    </p>
                  ) : (
                    <div className={cal.artistList}>
                      {monthArtists.map((artist) => {
                        const day = artist.birthday.split('-')[1];
                        return (
                          <Link
                            key={artist.id}
                            href={`/${locale}/artists/${artist.id}`}
                            className={cal.artistLink}
                          >
                            <span className={cal.artistDay}>{day}</span>
                            <span className={cal.artistLinkName}>{artist.name}</span>
                            {artist.group && (
                              <span className={cal.artistLinkGroup}>{artist.group}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn direction="up" delay={0.4}>
          <div className={cal.ctaSection}>
            <p className={cal.ctaText}>{t(m, 'calendar.cta')}</p>
            <Link href={`/${locale}/contact`} className={cal.ctaButton}>
              {t(m, 'calendar.inquire')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
