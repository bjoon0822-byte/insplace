// 광고 상품 리스트 — Supanova Design
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, AdType } from '@/types';
import { t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { adProducts } from '@/data/ads';
import { FadeIn } from '@/components/ui/FadeIn';
import styles from '../subpage.module.css';

interface AdListContentProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

const filterKeys: { key: AdType | 'all'; msgKey: string }[] = [
  { key: 'all', msgKey: 'ad.filterAll' },
  { key: 'digital', msgKey: 'ad.filterDigital' },
  { key: 'lightbox', msgKey: 'ad.filterLightbox' },
];

export default function AdListContent({ locale, messages }: AdListContentProps) {
  const [activeFilter, setActiveFilter] = useState<AdType | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? adProducts
    : adProducts.filter((ad) => ad.type === activeFilter);

  function getAvailText(status: string): string {
    if (status === 'available') return t(messages, 'ad.available');
    if (status === 'busy') return t(messages, 'ad.busy');
    return t(messages, 'ad.soldout');
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>ADS.</span>
        <div className={styles.pageHeroInner}>
          <span className={styles.pageEyebrow}>AD PRODUCTS</span>
          <h1 className={styles.pageTitle}>{t(messages, 'ad.title')}</h1>
          <p className={styles.pageSubtitle}>{t(messages, 'ad.subtitle')}</p>
        </div>
      </section>

      <div className={styles.filtersContainer}>
        {filterKeys.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {t(messages, f.msgKey)}
          </button>
        ))}
      </div>

      <div className={styles.sectionContainer}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p style={{ color: 'var(--gray-500)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {t(messages, 'ad.noResults')}
            </p>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              {t(messages, 'ad.tryOtherFilter')}
            </p>
          </div>
        ) : (
        <div className={styles.cardGrid}>
          {filtered.map((ad, idx) => (
            <FadeIn key={ad.id} delay={idx * 0.06} direction="up">
              <Link href={`/${locale}/ad/${ad.id}`} className={styles.card}>
                <div className={styles.cardInner}>
                  {ad.imageUrl && (
                    <div className={styles.cardImage}>
                      <Image
                        src={ad.imageUrl}
                        alt={(messages as any).adData?.[ad.id]?.name || ad.nameKey}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.cardImageOverlay} />
                      <span className={styles.cardTypeFloat}>
                        {ad.type.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={`badge badge-${ad.availability}`}>
                        {getAvailText(ad.availability)}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>
                      {(messages as any).adData?.[ad.id]?.name || ad.nameKey}
                    </h3>
                    <p className={styles.cardMeta}>
                      {(messages as any).adData?.[ad.id]?.location || ad.location} · {ad.region}
                    </p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        ₩{formatPrice(ad.price)} <span>/ {ad.pricePeriod}</span>
                      </span>
                      <span className={styles.metaSmall}>
                        {formatPrice(ad.views)}/{t(messages, 'ad.perDay').replace('/ ', '')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        )}
      </div>
    </>
  );
}
