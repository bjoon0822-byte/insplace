'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Locale, RecommendationResult, ParsedIntent, AdProduct, Venue, GoodsItem } from '@/types';
import { formatPrice } from '@/utils/format';
import styles from './RecommendationResults.module.css';

interface Props {
  results: RecommendationResult[];
  intent: ParsedIntent;
  locale: Locale;
  messages: Record<string, unknown>;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

const CATEGORY_KEYS: Record<string, string> = {
  ad: 'category.ad',
  venue: 'category.venue',
  goods: 'category.goods',
  popup: 'category.popup',
};

const CATEGORY_PATHS: Record<string, string> = {
  ad: 'ad',
  venue: 'venue',
  goods: 'goods',
  popup: 'popup',
};

function getProductName(result: RecommendationResult, messages: Record<string, unknown>): string {
  const p = result.product;
  if (result.category === 'ad') {
    const ad = p as AdProduct;
    const data = messages as Record<string, Record<string, Record<string, string>>>;
    return data?.adData?.[ad.id]?.name || ad.nameKey;
  }
  if (result.category === 'venue') {
    const venue = p as Venue;
    const data = messages as Record<string, Record<string, Record<string, string>>>;
    return data?.venueData?.[venue.id]?.name || venue.nameKey;
  }
  if (result.category === 'goods') {
    return (p as GoodsItem).nameKey;
  }
  return 'nameKey' in p ? (p as { nameKey: string }).nameKey : '';
}

function getProductImage(result: RecommendationResult): string {
  return result.product.imageUrl;
}

function getProductPrice(result: RecommendationResult): string {
  const p = result.product;
  if (result.category === 'ad') {
    const ad = p as AdProduct;
    return `₩${formatPrice(ad.price)} / ${ad.pricePeriod}`;
  }
  if (result.category === 'venue') {
    const venue = p as Venue;
    return `₩${formatPrice(venue.pricePerDay)}`;
  }
  if (result.category === 'goods') {
    const goods = p as GoodsItem;
    return `₩${formatPrice(goods.price)}`;
  }
  return '';
}

export default function RecommendationResults({ results, intent, locale, messages }: Props) {
  const t = (key: string) => getNestedValue(messages, key);

  if (results.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{t('recommend.noResults')}</p>
        <p className={styles.emptyDesc}>{t('recommend.tryDifferent')}</p>
      </div>
    );
  }

  // Build intent summary badges
  const badges: string[] = [];
  if (intent.regions.length > 0) {
    badges.push(...intent.regions.map((r) => r.replace('-', ' ')));
  }
  if (intent.purposes.length > 0 && intent.purposes[0] !== 'general') {
    const PURPOSE_KEYS: Record<string, string> = {
      birthday: 'caseStudy.birthday', debut: 'caseStudy.debut', comeback: 'caseStudy.comeback',
      drama: 'caseStudy.drama', concert: 'caseStudy.concert', anniversary: 'caseStudy.anniversary',
      graduation: 'caseStudy.graduation', general: 'caseStudy.general',
    };
    badges.push(...intent.purposes.map((p) => PURPOSE_KEYS[p] ? t(PURPOSE_KEYS[p]) : p));
  }
  if (intent.budgetMax) {
    const wan = Math.round(intent.budgetMax / 10000);
    badges.push(t('recommend.budgetUnder').replace('{amount}', String(wan)));
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Intent summary */}
      <div className={styles.intentRow}>
        <span className={styles.intentLabel}>{t('recommend.intentSummary')}</span>
        <div className={styles.intentBadges}>
          {badges.map((b, i) => (
            <span key={i} className={styles.intentBadge}>{b}</span>
          ))}
        </div>
        <span className={styles.resultCount}>
          {results.length}{t('recommend.resultCount')}
        </span>
      </div>

      {/* Result cards */}
      <div className={styles.grid}>
        {results.slice(0, 8).map((result, idx) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
          >
            <Link
              href={`/${locale}/${CATEGORY_PATHS[result.category]}/${result.id}`}
              className={styles.card}
            >
              <div className={styles.cardImageWrap}>
                <Image
                  src={getProductImage(result)}
                  alt={getProductName(result, messages)}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.cardImage}
                />
                <span className={styles.scoreBadge}>{result.score}%</span>
                <span className={styles.categoryBadge}>
                  {CATEGORY_KEYS[result.category] ? t(CATEGORY_KEYS[result.category]) : result.category}
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>
                  {getProductName(result, messages)}
                </h3>
                <div className={styles.reasons}>
                  {result.matchReasons.slice(0, 2).map((r, i) => (
                    <span key={i} className={styles.reasonTag}>{r}</span>
                  ))}
                </div>
                <p className={styles.cardPrice}>{getProductPrice(result)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View more */}
      <Link href={`/${locale}/explore`} className={styles.viewMore}>
        {t('recommend.viewMore')} →
      </Link>
    </motion.div>
  );
}
