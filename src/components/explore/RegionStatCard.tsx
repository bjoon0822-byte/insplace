'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { RegionStatistics } from '@/data/region-context';
import { t } from '@/i18n/request';
import { formatLargeNumber } from '@/utils/format';
import styles from './RegionStatCard.module.css';

interface Props {
  id: string;
  name: string;
  statistics: RegionStatistics;
  highlight: string;
  peakHours: string;
  delay?: number;
  isActive?: boolean;
  onClick: (regionId: string) => void;
  messages: Record<string, unknown>;
  locale?: string;
}

function useCountUp(target: number, duration: number, delay: number, isInView: boolean): number {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now() + delay * 1000;
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay, isInView]);

  return value;
}

export default function RegionStatCard({ id, name, statistics, highlight, peakHours, delay = 0, isActive, onClick, messages, locale = 'ko' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const visitors = useCountUp(statistics.dailyVisitors, 1400, delay, isInView);
  const subway = useCountUp(statistics.subwayDailyUsers, 1400, delay + 0.15, isInView);
  const ratio = useCountUp(statistics.externalVisitorRatio, 1200, delay + 0.3, isInView);

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={() => onClick(id)}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Background image + overlay */}
      <div className={styles.bgImage} style={{ backgroundImage: `url(${statistics.imageUrl})` }} />
      <div className={styles.bgOverlay} />
      <div className={styles.bgGradient} />

      {/* Animated scan line */}
      <motion.div
        className={styles.scanLine}
        initial={{ top: '0%' }}
        animate={isInView ? { top: ['0%', '100%', '0%'] } : {}}
        transition={{ duration: 4, delay: delay + 0.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <div className={styles.content}>
        {/* Top: English name + rank */}
        <div className={styles.topRow}>
          <motion.span
            className={styles.englishName}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {statistics.englishName}
          </motion.span>
          <span className={styles.rankBadge}>
            <span className={styles.rankNumber}>{statistics.subwayRank}</span>
            <span className={styles.rankSuffix}>{t(messages, 'region.rank')}</span>
          </span>
        </div>

        {/* Name */}
        <motion.h3
          className={styles.koreanName}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {name}
        </motion.h3>

        <div className={styles.highlight}>{highlight}</div>

        {/* Hero stat */}
        <div className={styles.heroStat}>
          <AnimatePresence>
            <motion.span
              key={visitors}
              className={styles.heroNumber}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatLargeNumber(visitors, locale)}
            </motion.span>
          </AnimatePresence>
          <span className={styles.heroUnit}>{t(messages, 'region.perDay')}</span>
          <div className={styles.heroLabel}>{t(messages, 'region.dailyVisitors')}</div>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{formatLargeNumber(subway, locale)}</div>
            <div className={styles.statLabel}>{t(messages, 'region.subwayUsers')}</div>
            <div className={styles.statBar}>
              <motion.div
                className={styles.statBarFill}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min((statistics.subwayDailyUsers / statistics.dailyVisitors) * 100, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{ratio}%</div>
            <div className={styles.statLabel}>{t(messages, 'region.externalVisitors')}</div>
            <div className={styles.statBar}>
              <motion.div
                className={styles.statBarFill}
                initial={{ width: 0 }}
                whileInView={{ width: `${statistics.externalVisitorRatio}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.peakHours}>PEAK {peakHours}</span>
          <span className={styles.cta}>
            {t(messages, 'region.explore')}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
