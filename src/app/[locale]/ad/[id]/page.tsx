// 광고 상품 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { adProducts } from '@/data/ads';
import { locales } from '@/i18n/routing';
import ReviewSection from '@/components/community/ReviewSection';
import CaseStudySection from '@/components/product/CaseStudySection';
import DesignReferenceGallery from '@/components/product/DesignReferenceGallery';
import AddToQuoteButton from '@/components/ui/AddToQuoteButton';
import styles from '../../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    adProducts.map((ad) => ({ locale, id: ad.id }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const ad = adProducts.find((a) => a.id === id);
  if (!ad) return { title: 'Not Found' };

  const name = (m as Record<string, Record<string, Record<string, string>>>).adData?.[ad.id]?.name || ad.nameKey;
  const loc = (m as Record<string, Record<string, Record<string, string>>>).adData?.[ad.id]?.location || ad.location;

  return {
    title: `${name} — ${loc}`,
    description: `₩${formatPrice(ad.price)} / ${ad.pricePeriod} · ${loc}`,
    openGraph: {
      title: name,
      description: `₩${formatPrice(ad.price)} / ${ad.pricePeriod} · ${loc}`,
      images: ad.imageUrl ? [{ url: ad.imageUrl, width: 800, height: 500 }] : [],
    },
  };
}

export default async function AdDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const ad = adProducts.find((a) => a.id === id);

  function getAvailText(status: string): string {
    if (status === 'available') return t(m, 'ad.available');
    if (status === 'busy') return t(m, 'ad.busy');
    return t(m, 'ad.soldout');
  }

  if (!ad) {
    return (
      <div className={styles.detailContainer}>
        <h1 className={styles.pageTitle}>{t(m, 'ad.title')}</h1>
        <Link href={`/${locale}/ad`} className="btn btn-secondary">← {t(m, 'sections.viewAll')}</Link>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <Link href={`/${locale}/ad`} className={styles.backLink}>
        ← {t(m, 'ad.title')}
      </Link>

      <div className={styles.detailGrid}>
        {ad.imageUrl && (
          <div className={styles.detailImageWrap}>
            <Image
              src={ad.imageUrl}
              alt={(m as any).adData?.[ad.id]?.name || ad.nameKey}
              width={800}
              height={500}
              style={{ objectFit: 'cover', borderRadius: '16px', width: '100%', height: 'auto' }}
              priority
            />
          </div>
        )}
        <div className={styles.detailInfo}>
          <div>
            <span className={`badge badge-${ad.availability}`} style={{ marginBottom: '12px', display: 'inline-flex' }}>
              {getAvailText(ad.availability)}
            </span>
            <h1 className={styles.detailTitle}>
              {(m as any).adData?.[ad.id]?.name || ad.nameKey}
            </h1>
          </div>

          <p className={styles.detailMeta}>
            {(m as any).adData?.[ad.id]?.location || ad.location} · {ad.region}
          </p>

          <div className={styles.detailPrice}>
            ₩{formatPrice(ad.price)} <span>/ {ad.pricePeriod}</span>
          </div>

          <p className={styles.detailDesc}>{ad.descriptionKey}</p>

          <table className={styles.specTable}>
            <tbody>
              {Object.entries(ad.specs).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val}</td>
                </tr>
              ))}
              <tr>
                <td>{t(m, 'ad.dailyViews')}</td>
                <td>{formatPrice(ad.views)}{t(m, 'venue.people')}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.detailCta}>
            <Link
              href={`/${locale}/contact?subject=ad&product=${encodeURIComponent((m as any).adData?.[ad.id]?.name || ad.nameKey)}`}
              className="btn btn-primary"
            >
              {t(m, 'ad.inquire')}
            </Link>
            <AddToQuoteButton
              item={{
                id: ad.id,
                type: 'ad',
                name: (m as any).adData?.[ad.id]?.name || ad.nameKey,
                price: ad.price,
                pricePeriod: ad.pricePeriod,
                imageUrl: ad.imageUrl,
              }}
              messages={m}
            />
          </div>

          <CaseStudySection productId={ad.id} productType="ad" messages={m} />
          <DesignReferenceGallery productId={ad.id} messages={m} />
          <ReviewSection targetType="ad" targetId={ad.id} messages={m} />
        </div>
      </div>
    </div>
  );
}
