// 굿즈 상품 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { goodsItems } from '@/data/goods';
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
    goodsItems.map((item) => ({ locale, id: item.id }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const item = goodsItems.find((g) => g.id === id);
  if (!item) return { title: 'Not Found' };

  return {
    title: `${item.nameKey} — ${t(m, `goods.${item.category}`)}`,
    description: item.descriptionKey,
    openGraph: {
      title: item.nameKey,
      description: `₩${formatPrice(item.price)} / ${t(m, 'goods.unit')} · ${item.descriptionKey}`,
      images: item.imageUrl ? [{ url: item.imageUrl, width: 800, height: 500 }] : [],
    },
  };
}

export default async function GoodsDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const m = await getMessages(locale as Locale);
  const item = goodsItems.find((g) => g.id === id);

  if (!item) {
    return (
      <div className={styles.detailContainer}>
        <h1 className={styles.pageTitle}>{t(m, 'goods.title')}</h1>
        <Link href={`/${locale}/goods`} className="btn btn-secondary">← {t(m, 'sections.viewAll')}</Link>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <Link href={`/${locale}/goods`} className={styles.backLink}>
        ← {t(m, 'goods.title')}
      </Link>

      <div className={styles.detailGrid}>
        {item.imageUrl && (
          <div className={styles.detailImageWrap}>
            <Image
              src={item.imageUrl}
              alt={item.nameKey}
              width={800}
              height={500}
              style={{ objectFit: 'cover', borderRadius: '16px', width: '100%', height: 'auto' }}
              priority
            />
          </div>
        )}
        <div className={styles.detailInfo}>
          <div>
            <span className={styles.categoryBadge} style={{ marginBottom: '12px', display: 'inline-flex' }}>
              {t(m, `goods.${item.category}`)}
            </span>
            <h1 className={styles.detailTitle}>{item.nameKey}</h1>
          </div>

          <div className={styles.detailPrice}>
            ₩{formatPrice(item.price)} <span>/ {t(m, 'goods.unit')}</span>
          </div>

          <p className={styles.detailDesc}>{item.descriptionKey}</p>

          <table className={styles.specTable}>
            <tbody>
              <tr>
                <td>{t(m, 'goods.minOrder')}</td>
                <td>{formatPrice(item.minOrder)}{t(m, 'goods.unit')}</td>
              </tr>
              {item.specs && Object.entries(item.specs).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.detailCta}>
            <Link
              href={`/${locale}/contact?subject=goods&product=${encodeURIComponent(item.nameKey)}`}
              className="btn btn-primary"
            >
              {t(m, 'ad.inquire')}
            </Link>
            <AddToQuoteButton
              item={{
                id: item.id,
                type: 'goods',
                name: item.nameKey,
                price: item.price,
                imageUrl: item.imageUrl,
              }}
              messages={m}
            />
          </div>

          <CaseStudySection productId={item.id} productType="goods" messages={m} />
          <DesignReferenceGallery productId={item.id} messages={m} />
          <ReviewSection targetType="goods" targetId={item.id} messages={m} />
        </div>
      </div>
    </div>
  );
}
