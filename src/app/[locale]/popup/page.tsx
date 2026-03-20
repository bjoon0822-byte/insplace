// 팝업스토어 리스트 — Supanova Design
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { popupEvents } from '@/data/popups';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PopupPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  function statusBadge(status: string) {
    if (status === 'ongoing') return 'badge-ongoing';
    if (status === 'upcoming') return 'badge-upcoming';
    return 'badge-ended';
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>POPUP.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>POPUP STORE</span>
            <h1 className={styles.pageTitle}>{t(m, 'popup.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'popup.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <div className={`${styles.cardGrid} ${styles.cardGrid2}`}>
          {popupEvents.map((popup, idx) => (
            <FadeIn key={popup.id} delay={idx * 0.06} direction="up">
              <div className={styles.card}>
                <div className={styles.cardInner}>
                  {popup.imageUrl && (
                    <div className={styles.cardImage}>
                      <Image
                        src={popup.imageUrl}
                        alt={popup.nameKey}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.cardImageOverlay} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={`badge ${statusBadge(popup.status)}`}>
                        {t(m, `popup.${popup.status}`)}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{popup.nameKey}</h3>
                    <p className={styles.cardMeta}>{popup.location}</p>
                    <p className={styles.cardDesc}>{popup.descriptionKey}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.dateRange}>
                        <svg className={styles.dateIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {popup.startDate} ~ {popup.endDate}
                      </span>
                      {popup.status !== 'ended' && (
                        <Link href={`/${locale}/contact`} className="btn btn-primary btn-small">
                          {t(m, 'ad.inquire')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
