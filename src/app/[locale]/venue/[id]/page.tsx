// 대관 장소 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { venues } from '@/data/venues';
import { locales } from '@/i18n/routing';
import ReviewSection from '@/components/community/ReviewSection';
import styles from '../../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    venues.map((venue) => ({ locale, id: venue.id }))
  );
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const venue = venues.find((v) => v.id === id);

  function getAvailText(status: string): string {
    if (status === 'available') return t(m, 'ad.available');
    if (status === 'busy') return t(m, 'ad.busy');
    return t(m, 'ad.soldout');
  }

  if (!venue) {
    return (
      <div className={styles.detailContainer}>
        <h1 className={styles.pageTitle}>{t(m, 'venue.title')}</h1>
        <Link href={`/${locale}/venue`} className="btn btn-secondary">← {t(m, 'sections.viewAll')}</Link>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <Link href={`/${locale}/venue`} className={styles.backLink}>
        ← {t(m, 'venue.title')}
      </Link>

      <div className={styles.detailGrid}>
        {venue.imageUrl && (
          <div className={styles.detailImageWrap}>
            <Image
              src={venue.imageUrl}
              alt={(m as any).venueData?.[venue.id]?.name || venue.nameKey}
              width={800}
              height={500}
              style={{ objectFit: 'cover', borderRadius: '16px', width: '100%', height: 'auto' }}
              priority
            />
          </div>
        )}
        <div className={styles.detailInfo}>
          <div>
            <span className={`badge badge-${venue.availability}`} style={{ marginBottom: '12px', display: 'inline-flex' }}>
              {getAvailText(venue.availability)}
            </span>
            <h1 className={styles.detailTitle}>
              {(m as any).venueData?.[venue.id]?.name || venue.nameKey}
            </h1>
          </div>

          <p className={styles.detailMeta}>
            {(m as any).venueData?.[venue.id]?.location || venue.location} · {venue.region}
          </p>

          <div className={styles.detailPrice}>
            ₩{formatPrice(venue.pricePerDay)} <span>/ {t(m, 'venue.pricePerDay')}</span>
          </div>

          <p className={styles.detailDesc}>{venue.descriptionKey}</p>

          <table className={styles.specTable}>
            <tbody>
              <tr>
                <td>{t(m, 'venue.capacity')}</td>
                <td>{venue.capacity}{t(m, 'venue.people')}</td>
              </tr>
              <tr>
                <td>{t(m, 'venue.amenities')}</td>
                <td>{venue.amenities.join(', ')}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.detailCta}>
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {t(m, 'ad.inquire')}
            </Link>
          </div>

          <ReviewSection targetType="venue" targetId={venue.id} messages={m} />
        </div>
      </div>
    </div>
  );
}
