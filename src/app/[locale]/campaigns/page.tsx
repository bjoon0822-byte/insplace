// 캠페인 목록 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { campaigns } from '@/data/campaigns';
import { FadeIn } from '@/components/ui/FadeIn';
import { formatPrice } from '@/utils/format';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }];
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return '진행중';
    case 'funded': return '달성완료';
    case 'completed': return '종료';
    case 'cancelled': return '취소';
    default: return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#16a34a';
    case 'funded': return '#d97706';
    case 'completed': return '#6b7280';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
}

export default async function CampaignsPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  const activeCampaigns = campaigns.filter((c) => c.status === 'active' || c.status === 'funded');
  const pastCampaigns = campaigns.filter((c) => c.status === 'completed' || c.status === 'cancelled');

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>CAMPAIGNS.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>FAN SUPPORT</span>
            <h1 className={styles.pageTitle}>{t(m, 'campaigns.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'campaigns.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        {/* Active Campaigns */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          {t(m, 'campaigns.activeCampaigns')}
        </h2>

        {activeCampaigns.length === 0 ? (
          <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '3rem' }}>
            {t(m, 'campaigns.noCampaigns')}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {activeCampaigns.map((campaign, idx) => {
              const progress = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
              const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <FadeIn key={campaign.id} delay={idx * 0.05} direction="up">
                  <Link href={`/${locale}/campaigns/${campaign.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: getStatusColor(campaign.status),
                            background: `${getStatusColor(campaign.status)}14`,
                            padding: '3px 8px',
                            borderRadius: '999px',
                          }}>
                            {getStatusLabel(campaign.status)}
                          </span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '8px', letterSpacing: '-0.01em' }}>
                            {campaign.title}
                          </h3>
                          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '4px' }}>
                            {campaign.artistName} · D-{daysLeft}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600 }}>₩{formatPrice(campaign.currentAmount)}</span>
                          <span style={{ color: 'var(--gray-500)' }}>{progress}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: 'var(--gray-100)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: progress >= 100 ? '#16a34a' : 'var(--accent)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease-out',
                          }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '6px' }}>
                          <span>{campaign.contributorCount}명 참여</span>
                          <span>{t(m, 'campaigns.target')}: ₩{formatPrice(campaign.targetAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Past Campaigns */}
        {pastCampaigns.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--gray-500)' }}>
              {t(m, 'campaigns.pastCampaigns')}
            </h2>
            <div className={styles.cardGrid}>
              {pastCampaigns.map((campaign, idx) => (
                <FadeIn key={campaign.id} delay={idx * 0.05} direction="up">
                  <Link href={`/${locale}/campaigns/${campaign.id}`} className={styles.card} style={{ textDecoration: 'none', opacity: 0.7 }}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardBody}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: getStatusColor(campaign.status),
                        }}>
                          {getStatusLabel(campaign.status)}
                        </span>
                        <h3 className={styles.cardTitle}>{campaign.title}</h3>
                        <p className={styles.cardDesc}>{campaign.artistName} · ₩{formatPrice(campaign.currentAmount)} 달성</p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <FadeIn direction="up" delay={0.15}>
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            marginTop: '2rem',
            background: 'var(--gray-50)',
            borderRadius: '16px',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {t(m, 'campaigns.startOwn')}
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t(m, 'campaigns.startOwnDesc')}
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
              {t(m, 'campaigns.inquire')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
