// 아이돌 목록 페이지
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

export default async function ArtistsPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  // Group by group name
  const groups = new Map<string, typeof artists>();
  for (const artist of artists) {
    const key = artist.group || '솔로';
    const arr = groups.get(key) || [];
    arr.push(artist);
    groups.set(key, arr);
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>ARTISTS.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>K-POP ARTISTS</span>
            <h1 className={styles.pageTitle}>{t(m, 'artists.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'artists.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <div className={styles.cardGrid}>
          {artists.map((artist, idx) => (
            <FadeIn key={artist.id} delay={idx * 0.05} direction="up">
              <Link href={`/${locale}/artists/${artist.id}`} className={styles.card} style={{ textDecoration: 'none' }}>
                <div className={styles.cardInner}>
                  <div className={styles.cardImage} style={{ background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    <span role="img" aria-label={artist.name}>
                      {artist.group ? artist.group.charAt(0) : artist.name.charAt(0)}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.categoryBadge}>
                        {artist.group || 'Solo'}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{artist.name}</h3>
                    <p className={styles.cardDesc} style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      {artist.nameEn} · {artist.birthday}
                    </p>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {artist.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          background: 'var(--gray-100)',
                          borderRadius: '999px',
                          color: 'var(--gray-600)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
