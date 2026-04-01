'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { RecommendationResult, AdProduct, Venue, GoodsItem, Locale } from '@/types';
import { formatPrice } from '@/utils/format';
import { t } from '@/i18n/request';
import styles from './ChatProductCard.module.css';

const CATEGORY_KEYS: Record<string, string> = {
  ad: 'category.ad',
  venue: 'category.venue',
  goods: 'category.goods',
  popup: 'category.popup',
};

interface Props {
  result: RecommendationResult;
  locale: Locale;
  messages?: Record<string, unknown>;
}

export default function ChatProductCard({ result, locale, messages = {} }: Props) {
  const { category, score, product } = result;
  const p = product as unknown as Record<string, unknown>;

  const name = (p.nameKey as string) || '';
  const imageUrl = (p.imageUrl as string) || '';
  const href = `/${locale}/${category}/${result.id}`;

  let priceText = '';
  if (category === 'ad') {
    const ad = product as AdProduct;
    priceText = `₩${formatPrice(ad.price)}`;
  } else if (category === 'venue') {
    const venue = product as Venue;
    priceText = `₩${formatPrice(venue.pricePerDay)}`;
  } else if (category === 'goods') {
    const goods = product as GoodsItem;
    priceText = `₩${formatPrice(goods.price)}`;
  }

  return (
    <Link href={href} className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="56px"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <div className={styles.meta}>
          <span className={styles.categoryBadge}>
            {CATEGORY_KEYS[category] ? t(messages, CATEGORY_KEYS[category]) : category}
          </span>
          <span className={styles.scoreBadge}>{score}%</span>
        </div>
        {priceText && (
          <span className={styles.price}>
            {priceText}
            {category === 'ad' && (
              <span> / {(product as AdProduct).pricePeriod}</span>
            )}
            {category === 'venue' && <span> {t(messages, 'ad.perDay')}</span>}
          </span>
        )}
      </div>
    </Link>
  );
}
