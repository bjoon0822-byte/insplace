// 팝업스토어 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { popupEvents } from '@/data/popups';
import { locales } from '@/i18n/routing';
import CaseStudySection from '@/components/product/CaseStudySection';
import ReviewSection from '@/components/community/ReviewSection';
import styles from '../../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    popupEvents.map((popup) => ({ locale, id: popup.id }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const popup = popupEvents.find((p) => p.id === id);
  if (!popup) return { title: 'Not Found' };

  return {
    title: `${popup.nameKey} — ${popup.location}`,
    description: popup.descriptionKey,
    openGraph: {
      title: popup.nameKey,
      description: `${popup.location} · ${popup.startDate} ~ ${popup.endDate}`,
      images: popup.imageUrl ? [{ url: popup.imageUrl, width: 800, height: 500 }] : [],
    },
  };
}

function getDday(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return `D+${Math.abs(diff)}`;
}

function getProgress(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

export default async function PopupDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const popup = popupEvents.find((p) => p.id === id);

  function statusBadgeClass(status: string) {
    if (status === 'ongoing') return 'badge-ongoing';
    if (status === 'upcoming') return 'badge-upcoming';
    return 'badge-ended';
  }

  if (!popup) {
    return (
      <div className={styles.detailContainer}>
        <h1 className={styles.pageTitle}>{t(m, 'popup.title')}</h1>
        <Link href={`/${locale}/popup`} className="btn btn-secondary">← {t(m, 'sections.viewAll')}</Link>
      </div>
    );
  }

  const progress = getProgress(popup.startDate, popup.endDate);
  const dday = popup.status === 'upcoming' ? getDday(popup.startDate) : popup.status === 'ongoing' ? getDday(popup.endDate) : '';

  return (
    <div className={styles.detailContainer}>
      <Link href={`/${locale}/popup`} className={styles.backLink}>
        ← {t(m, 'popup.title')}
      </Link>

      <div className={styles.detailGrid}>
        {popup.imageUrl && (
          <div className={styles.detailImageWrap}>
            <Image
              src={popup.imageUrl}
              alt={popup.nameKey}
              width={800}
              height={500}
              style={{ objectFit: 'cover', borderRadius: '16px', width: '100%', height: 'auto' }}
              priority
            />
          </div>
        )}
        <div className={styles.detailInfo}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className={`badge ${statusBadgeClass(popup.status)}`}>
                {t(m, `popup.${popup.status}`)}
              </span>
              {dday && (
                <span className={styles.ddayBadge}>{dday}</span>
              )}
            </div>
            <h1 className={styles.detailTitle}>{popup.nameKey}</h1>
          </div>

          <p className={styles.detailMeta}>{popup.location}</p>

          {/* 이벤트 타임라인 */}
          <div className={styles.eventTimeline}>
            <div className={styles.timelineDates}>
              <span>{popup.startDate}</span>
              <span>{popup.endDate}</span>
            </div>
            <div className={styles.timelineBar}>
              <div className={styles.timelineProgress} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <p className={styles.detailDesc}>{popup.descriptionKey}</p>

          <table className={styles.specTable}>
            <tbody>
              <tr>
                <td>{t(m, 'popup.period')}</td>
                <td>{popup.startDate} ~ {popup.endDate}</td>
              </tr>
              <tr>
                <td>{t(m, 'venue.amenities')}</td>
                <td>{popup.location}</td>
              </tr>
            </tbody>
          </table>

          {popup.status !== 'ended' && (
            <div className={styles.detailCta}>
              <Link
                href={`/${locale}/contact?subject=popup&product=${encodeURIComponent(popup.nameKey)}`}
                className="btn btn-primary"
              >
                {t(m, 'ad.inquire')}
              </Link>
            </div>
          )}

          <CaseStudySection productId={popup.id} productType="popup" messages={m} />
          <ReviewSection targetType="popup" targetId={popup.id} messages={m} />
        </div>
      </div>
    </div>
  );
}
