// 아이돌 상세 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { artists } from '@/data/artists';
import { adProducts } from '@/data/ads';
import { FadeIn } from '@/components/ui/FadeIn';
import ShareButton from '@/components/ui/ShareButton';
import styles from '../../subpage.module.css';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const locales = ['ko', 'en', 'ja', 'zh'];
  return locales.flatMap((locale) =>
    artists.map((a) => ({ locale, id: a.id }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artist = artists.find((a) => a.id === id);
  if (!artist) return { title: 'Artist Not Found' };
  return {
    title: `${artist.name} (${artist.nameEn}) - InsPlace`,
    description: `${artist.name} ${artist.group ? `(${artist.group})` : ''} 생일 광고, 팬 서포트, 캠페인`,
  };
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const artist = artists.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className={styles.sectionContainer}>
        <p>{t(m, 'artists.notFound')}</p>
        <Link href={`/${locale}/artists`}>{t(m, 'artists.backToList')}</Link>
      </div>
    );
  }

  // Upcoming birthday calculation
  const now = new Date();
  const [bMonth, bDay] = artist.birthday.split('-').map(Number);
  let nextBirthday = new Date(now.getFullYear(), bMonth - 1, bDay);
  if (nextBirthday < now) {
    nextBirthday = new Date(now.getFullYear() + 1, bMonth - 1, bDay);
  }
  const daysUntil = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Recommended products for birthday ads
  const recommended = adProducts.slice(0, 3);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>{artist.nameEn.toUpperCase()}.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>{artist.group || 'SOLO ARTIST'}</span>
            <h1 className={styles.pageTitle}>{artist.name}</h1>
            <p className={styles.pageSubtitle}>{artist.nameEn}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        {/* Artist Info Card */}
        <FadeIn direction="up">
          <div style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--gray-200)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{artist.name}</h2>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                  {artist.group && <>{artist.group} · </>}
                  {artist.birthday} · {artist.birthYear}{t(m, 'artists.born')}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {artist.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      background: 'var(--gray-100)',
                      borderRadius: '999px',
                      color: 'var(--gray-600)',
                      fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ShareButton title={`${artist.name} - InsPlace`} text={t(m, 'artists.shareText').replace('{name}', artist.name)} messages={m as Record<string, unknown>} />
            </div>

            {/* Birthday countdown */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: daysUntil <= 30 ? 'rgba(217, 119, 6, 0.06)' : 'var(--gray-50)',
              borderRadius: '12px',
              border: daysUntil <= 30 ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid var(--gray-200)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>🎂</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {t(m, 'artists.nextBirthday')}: {nextBirthday.toLocaleDateString()}
                  </p>
                  <p style={{ color: daysUntil <= 30 ? 'var(--accent)' : 'var(--gray-500)', fontWeight: daysUntil <= 30 ? 600 : 400, fontSize: '0.85rem' }}>
                    D-{daysUntil}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Recommended ad products */}
        <FadeIn direction="up" delay={0.1}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {t(m, 'artists.recommendedAds')}
          </h3>
          <div className={styles.cardGrid}>
            {recommended.map((ad) => (
              <Link key={ad.id} href={`/${locale}/ad/${ad.id}`} className={styles.card} style={{ textDecoration: 'none' }}>
                <div className={styles.cardInner}>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.categoryBadge}>{ad.type}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{ad.nameKey}</h3>
                    <p className={styles.cardDesc}>{ad.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn direction="up" delay={0.2}>
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            marginTop: '2rem',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
              {artist.name}{t(m, 'artists.startCampaign')}
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
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              {t(m, 'artists.inquire')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
