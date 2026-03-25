// 팬 여정 패키지 카드 — 3단계 동선 시각화
'use client';

import Link from 'next/link';
import type { JourneyPackage, AdProduct, Venue, GoodsItem, Locale } from '@/types';
import { formatPrice } from '@/utils/format';
import styles from './ChatJourneyCard.module.css';

const ROLE_CONFIG = {
  attention: { icon: '📡', label: 'STEP 1 · 관심 끌기', badgeClass: styles.stepBadgeAttention },
  gathering: { icon: '☕', label: 'STEP 2 · 팬 모임', badgeClass: styles.stepBadgeGathering },
  memento: { icon: '🎁', label: 'STEP 3 · 기념품', badgeClass: styles.stepBadgeMemento },
} as const;

interface Props {
  journey: JourneyPackage;
  locale: Locale;
}

function getStepPrice(step: JourneyPackage['steps'][number]): string {
  const { category, product } = step.product;

  if (category === 'ad') {
    const ad = product as AdProduct;
    return `₩${formatPrice(ad.price)} / ${ad.pricePeriod}`;
  }
  if (category === 'venue') {
    const venue = product as Venue;
    return `₩${formatPrice(venue.pricePerDay)} / 일`;
  }
  if (category === 'goods') {
    const goods = product as GoodsItem;
    return `₩${formatPrice(goods.price)} / 개`;
  }
  return '가격 미정';
}

function getStepName(step: JourneyPackage['steps'][number]): string {
  const p = step.product.product as unknown as Record<string, unknown>;
  return (p.nameKey as string) || '';
}

export default function ChatJourneyCard({ journey, locale }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>🎯</span>
        <span className={styles.headerTitle}>{journey.name}</span>
      </div>
      <div className={styles.headerMeta}>
        {journey.regionInfo || journey.description}
      </div>

      <div className={styles.steps}>
        {journey.steps.map((step, idx) => {
          const config = ROLE_CONFIG[step.role];

          return (
            <div key={step.order}>
              <div className={styles.step}>
                <div className={`${styles.stepBadge} ${config.badgeClass}`}>
                  {config.icon}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepLabel}>{config.label}</div>
                  <div className={styles.stepName}>{getStepName(step)}</div>
                  <div className={styles.stepPrice}>{getStepPrice(step)}</div>
                  <div className={styles.stepNote}>{step.note}</div>
                </div>
              </div>
              {idx < journey.steps.length - 1 && (
                <div className={styles.connector} />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span className={styles.totalCost}>
          예상 총 비용{' '}
          <span className={styles.totalCostValue}>
            ₩{formatPrice(journey.totalEstimate)}
          </span>
        </span>
        <Link href={`/${locale}/explore`} className={styles.exploreLink}>
          더 많은 옵션 보기 →
        </Link>
      </div>
    </div>
  );
}
