// 장소 대관 리스트 — Supanova Design
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { venues } from '@/data/venues';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function VenuePage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  function getAvailText(status: string): string {
    if (status === 'available') return t(m, 'ad.available');
    if (status === 'busy') return t(m, 'ad.busy');
    return t(m, 'ad.soldout');
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>VENUE.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>VENUE RENTAL</span>
            <h1 className={styles.pageTitle}>{t(m, 'venue.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'venue.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <div className={styles.cardGrid}>
          {venues.map((venue, idx) => (
            <FadeIn key={venue.id} delay={idx * 0.06} direction="up">
              <Link href={`/${locale}/venue/${venue.id}`} className={styles.card}>
                <div className={styles.cardInner}>
                  <div className={styles.cardImage}>
                    {venue.imageUrl && (
                      <Image
                        src={venue.imageUrl}
                        alt={(m as any).venueData?.[venue.id]?.name || venue.nameKey}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    <div className={styles.cardImageOverlay} />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={`badge badge-${venue.availability}`}>
                        {getAvailText(venue.availability)}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>
                      {(m as any).venueData?.[venue.id]?.name || venue.nameKey}
                    </h3>
                    <p className={styles.cardMeta}>
                      {(m as any).venueData?.[venue.id]?.location || venue.location}
                    </p>
                    <div className={styles.amenityList}>
                      {venue.amenities.slice(0, 3).map((a) => (
                        <span key={a} className={styles.amenityTag}>{a}</span>
                      ))}
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        ₩{formatPrice(venue.pricePerDay)} <span>/ {t(m, 'venue.pricePerDay')}</span>
                      </span>
                      <span className={styles.metaSmall}>
                        {venue.capacity}{t(m, 'venue.people')}
                      </span>
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
