// 팬 여정 패키지 카드 — 3단계 동선 시각화
'use client';

import Link from 'next/link';
import type { JourneyPackage, AdProduct, Venue, GoodsItem, Locale } from '@/types';
import { t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import styles from './ChatJourneyCard.module.css';

interface Props {
  journey: JourneyPackage;
  locale: Locale;
  messages: Record<string, unknown>;
}

function getRoleConfig(messages: Record<string, unknown>) {
  return {
    attention: { icon: '📡', label: `STEP 1 · ${t(messages, 'journey.roleAttention')}`, badgeClass: styles.stepBadgeAttention },
    gathering: { icon: '☕', label: `STEP 2 · ${t(messages, 'journey.roleGathering')}`, badgeClass: styles.stepBadgeGathering },
    memento: { icon: '🎁', label: `STEP 3 · ${t(messages, 'journey.roleMemento')}`, badgeClass: styles.stepBadgeMemento },
  } as const;
}

function getStepPrice(step: JourneyPackage['steps'][number], messages: Record<string, unknown>): string {
  const { category, product } = step.product;

  if (category === 'ad') {
    const ad = product as AdProduct;
    return `₩${formatPrice(ad.price)} / ${ad.pricePeriod}`;
  }
  if (category === 'venue') {
    const venue = product as Venue;
    return `₩${formatPrice(venue.pricePerDay)} / ${t(messages, 'journey.perDay')}`;
  }
  if (category === 'goods') {
    const goods = product as GoodsItem;
    return `₩${formatPrice(goods.price)} / ${t(messages, 'journey.perUnit')}`;
  }
  return t(messages, 'journey.priceUndetermined');
}

function getStepName(step: JourneyPackage['steps'][number]): string {
  const p = step.product.product as unknown as Record<string, unknown>;
  return (p.nameKey as string) || '';
}

export default function ChatJourneyCard({ journey, locale, messages }: Props) {
  const roleConfig = getRoleConfig(messages);

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
          const config = roleConfig[step.role];

          return (
            <div key={step.order}>
              <div className={styles.step}>
                <div className={`${styles.stepBadge} ${config.badgeClass}`}>
                  {config.icon}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepLabel}>{config.label}</div>
                  <div className={styles.stepName}>{getStepName(step)}</div>
                  <div className={styles.stepPrice}>{getStepPrice(step, messages)}</div>
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
          {t(messages, 'journey.estimatedTotal')}{' '}
          <span className={styles.totalCostValue}>
            ₩{formatPrice(journey.totalEstimate)}
          </span>
        </span>
        <Link href={`/${locale}/explore`} className={styles.exploreLink}>
          {t(messages, 'journey.moreOptions')}
        </Link>
      </div>
    </div>
  );
}
