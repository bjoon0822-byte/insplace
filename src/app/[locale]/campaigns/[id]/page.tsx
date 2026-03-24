// 캠페인 상세 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { campaigns } from '@/data/campaigns';
import { artists } from '@/data/artists';
import { FadeIn } from '@/components/ui/FadeIn';
import { formatPrice } from '@/utils/format';
import ShareButton from '@/components/ui/ShareButton';
import styles from '../../subpage.module.css';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  const locales = ['ko', 'en', 'ja', 'zh'];
  return locales.flatMap((locale) =>
    campaigns.map((c) => ({ locale, id: c.id }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return { title: 'Campaign Not Found' };
  return {
    title: `${campaign.title} - InsPlace`,
    description: campaign.description,
  };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className={styles.sectionContainer}>
        <p>캠페인을 찾을 수 없습니다.</p>
        <Link href={`/${locale}/campaigns`}>목록으로</Link>
      </div>
    );
  }

  const artist = artists.find((a) => a.id === campaign.artistId);
  const progress = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isActive = campaign.status === 'active';

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>CAMPAIGN.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>{campaign.artistName}</span>
            <h1 className={styles.pageTitle}>{campaign.title}</h1>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <FadeIn direction="up">
          {/* Main info card */}
          <div style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--gray-200)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {campaign.description}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      ₩{formatPrice(campaign.currentAmount)}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, color: progress >= 100 ? '#16a34a' : 'var(--accent)' }}>
                      {progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--gray-100)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progress >= 100 ? '#16a34a' : 'var(--accent)',
                      borderRadius: '4px',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '8px' }}>
                    <span>{t(m, 'campaigns.target')}: ₩{formatPrice(campaign.targetAmount)}</span>
                    <span>{campaign.contributorCount}명 참여</span>
                  </div>
                </div>

                {/* Meta info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{t(m, 'campaigns.period')}</p>
                    <p style={{ fontWeight: 600 }}>{campaign.startDate} ~ {campaign.endDate}</p>
                  </div>
                  <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{t(m, 'campaigns.daysLeft')}</p>
                    <p style={{ fontWeight: 600, color: daysLeft <= 7 ? '#ef4444' : 'inherit' }}>D-{daysLeft}</p>
                  </div>
                  <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '10px' }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{t(m, 'campaigns.organizer')}</p>
                    <p style={{ fontWeight: 600 }}>{campaign.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {isActive && (
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
                    fontSize: '0.95rem',
                  }}
                >
                  {t(m, 'campaigns.participate')}
                </Link>
              )}
              <ShareButton title={campaign.title} text={campaign.description} />
            </div>
          </div>
        </FadeIn>

        {/* Artist link */}
        {artist && (
          <FadeIn direction="up" delay={0.1}>
            <Link
              href={`/${locale}/artists/${artist.id}`}
              style={{
                display: 'block',
                background: 'var(--gray-50)',
                border: '1px solid var(--gray-200)',
                borderRadius: '12px',
                padding: '1.25rem',
                textDecoration: 'none',
                color: 'inherit',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>아티스트</p>
              <p style={{ fontWeight: 700 }}>{artist.name} <span style={{ color: 'var(--gray-400)' }}>({artist.nameEn})</span></p>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{artist.group || 'Solo'}</p>
            </Link>
          </FadeIn>
        )}

        {/* Proof images */}
        {campaign.proofImages.length > 0 && (
          <FadeIn direction="up" delay={0.15}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {t(m, 'campaigns.proofPhotos')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {campaign.proofImages.map((img, i) => (
                <div key={i} style={{
                  aspectRatio: '4/3',
                  background: 'var(--gray-100)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-400)',
                  fontSize: '0.85rem',
                }}>
                  인증샷 {i + 1}
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
}
