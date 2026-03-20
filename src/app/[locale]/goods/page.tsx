// 굿즈 리스트 — Supanova Design
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { goodsItems } from '@/data/goods';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function GoodsPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>GOODS.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>MERCHANDISE</span>
            <h1 className={styles.pageTitle}>{t(m, 'goods.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'goods.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <div className={styles.cardGrid}>
          {goodsItems.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.06} direction="up">
              <div className={styles.card}>
                <div className={styles.cardInner}>
                  {item.imageUrl && (
                    <div className={styles.cardImage}>
                      <Image
                        src={item.imageUrl}
                        alt={item.nameKey}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.cardImageOverlay} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.categoryBadge}>
                        {t(m, `goods.${item.category}`)}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{item.nameKey}</h3>
                    <p className={styles.cardDesc}>{item.descriptionKey}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        ₩{formatPrice(item.price)} <span>/ {t(m, 'goods.unit')}</span>
                      </span>
                      <span className={styles.metaSmall}>
                        {t(m, 'goods.minOrder')}: {item.minOrder}{t(m, 'goods.unit')}
                      </span>
                    </div>
                    <Link href={`/${locale}/contact`} className={styles.inquireBtn}>
                      {t(m, 'ad.inquire')}
                    </Link>
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
