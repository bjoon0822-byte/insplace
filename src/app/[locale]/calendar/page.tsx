// 생일 캘린더 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { artists } from '@/data/artists';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const monthArtists = byMonth.get(month) || [];
            const isCurrent = month === currentMonth;

            return (
              <FadeIn key={month} delay={month * 0.03} direction="up">
                <div style={{
                  background: 'var(--bg-main)',
                  border: isCurrent ? '2px solid var(--accent)' : '1px solid var(--gray-200)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  minHeight: '120px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: isCurrent ? 'var(--accent)' : 'var(--gray-900)',
                    }}>
                      {MONTH_NAMES_KO[month - 1]}
                    </h3>
                    {isCurrent && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        background: 'rgba(217, 119, 6, 0.1)',
                        color: 'var(--accent)',
                        borderRadius: '999px',
                      }}>
                        {t(m, 'calendar.thisMonth')}
                      </span>
                    )}
                  </div>

                  {monthArtists.length === 0 ? (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>
                      {t(m, 'calendar.noEvents')}
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {monthArtists.map((artist) => {
                        const day = artist.birthday.split('-')[1];
                        return (
                          <Link
                            key={artist.id}
                            href={`/${locale}/artists/${artist.id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px',
                              borderRadius: '8px',
                              background: 'var(--gray-50)',
                              textDecoration: 'none',
                              color: 'inherit',
                              transition: 'background 0.2s',
                              fontSize: '0.85rem',
                            }}
                          >
                            <span style={{
                              fontWeight: 700,
                              fontVariantNumeric: 'tabular-nums',
                              color: 'var(--accent)',
                              minWidth: '28px',
                            }}>
                              {day}
                            </span>
                            <span style={{ fontWeight: 600 }}>{artist.name}</span>
                            {artist.group && (
                              <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                                {artist.group}
                              </span>
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

        {/* CTA */}
        <FadeIn direction="up" delay={0.4}>
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            marginTop: '2rem',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              {t(m, 'calendar.cta')}
            </p>
            <Link
              href={`/${locale}/contact`}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {t(m, 'calendar.inquire')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
