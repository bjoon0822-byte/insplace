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
import cs from '../campaigns.module.css';
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
          <div className={cs.detailCard}>
            <div className={cs.detailLayout}>
              <div className={cs.detailContent}>
                <p className={cs.detailDesc}>{campaign.description}</p>

                <div className={cs.detailProgress}>
                  <div className={cs.detailProgressHeader}>
                    <span className={cs.detailAmount}>
                      ₩{formatPrice(campaign.currentAmount)}
                    </span>
                    <span className={cs.detailPercent} style={{ color: progress >= 100 ? '#16a34a' : 'var(--accent)' }}>
                      {progress}%
                    </span>
                  </div>
                  <div className={cs.detailProgressTrack}>
                    <div
                      className={cs.detailProgressFill}
                      style={{
                        width: `${progress}%`,
                        background: progress >= 100 ? '#16a34a' : 'var(--accent)',
                      }}
                    />
                  </div>
                  <div className={cs.detailProgressFooter}>
                    <span>{t(m, 'campaigns.target')}: ₩{formatPrice(campaign.targetAmount)}</span>
                    <span>{campaign.contributorCount}명 참여</span>
                  </div>
                </div>

                <div className={cs.metaGrid}>
                  <div className={cs.metaBox}>
                    <p className={cs.metaLabel}>{t(m, 'campaigns.period')}</p>
                    <p className={cs.metaValue}>{campaign.startDate} ~ {campaign.endDate}</p>
                  </div>
                  <div className={cs.metaBox}>
                    <p className={cs.metaLabel}>{t(m, 'campaigns.daysLeft')}</p>
                    <p className={daysLeft <= 7 ? cs.metaValueUrgent : cs.metaValue}>D-{daysLeft}</p>
                  </div>
                  <div className={cs.metaBox}>
                    <p className={cs.metaLabel}>{t(m, 'campaigns.organizer')}</p>
                    <p className={cs.metaValue}>{campaign.createdBy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cs.actionRow}>
              {isActive && (
                <Link href={`/${locale}/contact`} className={cs.participateBtn}>
                  {t(m, 'campaigns.participate')}
                </Link>
              )}
              <ShareButton title={campaign.title} text={campaign.description} />
            </div>
          </div>
        </FadeIn>

        {artist && (
          <FadeIn direction="up" delay={0.1}>
            <Link href={`/${locale}/artists/${artist.id}`} className={cs.artistCard}>
              <p className={cs.artistLabel}>아티스트</p>
              <p className={cs.artistName}>
                {artist.name} <span className={cs.artistNameEn}>({artist.nameEn})</span>
              </p>
              <p className={cs.artistGroup}>{artist.group || 'Solo'}</p>
            </Link>
          </FadeIn>
        )}

        {campaign.proofImages.length > 0 && (
          <FadeIn direction="up" delay={0.15}>
            <h3 className={cs.proofTitle}>{t(m, 'campaigns.proofPhotos')}</h3>
            <div className={cs.proofGrid}>
              {campaign.proofImages.map((img, i) => (
                <div key={i} className={cs.proofImage}>
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
