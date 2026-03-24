// 캠페인 목록 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { campaigns } from '@/data/campaigns';
import { FadeIn } from '@/components/ui/FadeIn';
import { formatPrice } from '@/utils/format';
import styles from '../subpage.module.css';
import cs from './campaigns.module.css';

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
        <h2 className={cs.sectionTitle}>
          {t(m, 'campaigns.activeCampaigns')}
        </h2>

        {activeCampaigns.length === 0 ? (
          <p className={cs.emptyState}>
            {t(m, 'campaigns.noCampaigns')}
          </p>
        ) : (
          <div className={cs.campaignList}>
            {activeCampaigns.map((campaign, idx) => {
              const progress = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
              const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <FadeIn key={campaign.id} delay={idx * 0.05} direction="up">
                  <Link href={`/${locale}/campaigns/${campaign.id}`} className={cs.campaignLink}>
                    <div className={cs.campaignCard}>
                      <div className={cs.campaignHeader}>
                        <div>
                          <span
                            className={cs.statusBadge}
                            style={{
                              color: getStatusColor(campaign.status),
                              background: `${getStatusColor(campaign.status)}14`,
                            }}
                          >
                            {getStatusLabel(campaign.status)}
                          </span>
                          <h3 className={cs.campaignTitle}>{campaign.title}</h3>
                          <p className={cs.campaignSubtext}>
                            {campaign.artistName} · D-{daysLeft}
                          </p>
                        </div>
                      </div>

                      <div className={cs.progressSection}>
                        <div className={cs.progressHeader}>
                          <span className={cs.progressAmount}>₩{formatPrice(campaign.currentAmount)}</span>
                          <span className={cs.progressPercent}>{progress}%</span>
                        </div>
                        <div className={cs.progressTrack}>
                          <div
                            className={cs.progressFill}
                            style={{
                              width: `${progress}%`,
                              background: progress >= 100 ? '#16a34a' : 'var(--accent)',
                            }}
                          />
                        </div>
                        <div className={cs.progressFooter}>
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

        {pastCampaigns.length > 0 && (
          <>
            <h2 className={cs.sectionTitleMuted}>
              {t(m, 'campaigns.pastCampaigns')}
            </h2>
            <div className={styles.cardGrid}>
              {pastCampaigns.map((campaign, idx) => (
                <FadeIn key={campaign.id} delay={idx * 0.05} direction="up">
                  <Link href={`/${locale}/campaigns/${campaign.id}`} className={styles.card} style={{ opacity: 0.7 }}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardBody}>
                        <span className={cs.pastStatusBadge} style={{ color: getStatusColor(campaign.status) }}>
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

        <FadeIn direction="up" delay={0.15}>
          <div className={cs.ctaSection}>
            <p className={cs.ctaTitle}>{t(m, 'campaigns.startOwn')}</p>
            <p className={cs.ctaDesc}>{t(m, 'campaigns.startOwnDesc')}</p>
            <Link href={`/${locale}/contact`} className={cs.ctaButton}>
              {t(m, 'campaigns.inquire')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
