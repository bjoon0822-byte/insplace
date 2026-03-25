'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { RegionInfo } from '@/types';
import { formatLargeNumber } from '@/utils/format';
import styles from './ChatRegionCard.module.css';

/** 지역별 이미지 URL */
const REGION_IMAGES: Record<string, string> = {
  '서울-마포': 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=600&q=70',
  '서울-강남': 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&q=70',
  '서울-성동': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=70',
  '서울-송파': 'https://images.unsplash.com/photo-1546874177-9e664107314e?w=600&q=70',
  '서울-종로': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=70',
  '서울-중구': 'https://images.unsplash.com/photo-1583167617666-6ccc608de0b4?w=600&q=70',
  '서울-영등포': 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=600&q=70',
  '서울-용산': 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=600&q=70',
  '서울-광진': 'https://images.unsplash.com/photo-1551522355-dbf80597eba8?w=600&q=70',
  '서울-강남2': 'https://images.unsplash.com/photo-1573152958734-1922c188fba3?w=600&q=70',
};

interface Props {
  regionInfo: RegionInfo;
}

function useCountUp(target: number, duration: number): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function ChatRegionCard({ regionInfo }: Props) {
  const router = useRouter();
  const visitors = useCountUp(regionInfo.dailyVisitors, 1200);
  const subway = useCountUp(regionInfo.subwayDailyUsers, 1200);
  const ratio = useCountUp(regionInfo.externalVisitorRatio, 1000);
  const imageUrl = REGION_IMAGES[regionInfo.id];

  const handleExplore = () => {
    router.push(`/ko/explore?region=${encodeURIComponent(regionInfo.id)}&step=2`);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background image */}
      {imageUrl && (
        <>
          <div className={styles.bgImage} style={{ backgroundImage: `url(${imageUrl})` }} />
          <div className={styles.bgOverlay} />
        </>
      )}

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>📍</span>
            <span className={styles.headerName}>{regionInfo.name}</span>
          </div>
          <span className={styles.rankBadge}>
            서울 {regionInfo.subwayRank}위
          </span>
        </div>

        <div className={styles.highlight}>{regionInfo.stationHighlight}</div>

        {/* Big stat row */}
        <div className={styles.statsGrid}>
          <motion.div
            className={styles.mainStat}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className={styles.mainValue}>{formatLargeNumber(visitors)}명</div>
            <div className={styles.mainLabel}>1일 유동인구</div>
          </motion.div>

          <div className={styles.subStats}>
            <motion.div
              className={styles.stat}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.statValue}>{formatLargeNumber(subway)}명</div>
              <div className={styles.statLabel}>지하철 이용객</div>
              <div className={styles.statBar}>
                <motion.div
                  className={styles.statBarFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((regionInfo.subwayDailyUsers / regionInfo.dailyVisitors) * 100, 100)}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>

            <motion.div
              className={styles.stat}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.statValue}>{ratio}%</div>
              <div className={styles.statLabel}>외부 방문객</div>
              <div className={styles.statBar}>
                <motion.div
                  className={styles.statBarFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${regionInfo.externalVisitorRatio}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommendation */}
        <motion.div
          className={styles.recommendation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {regionInfo.recommendation}
        </motion.div>

        {/* CTA — navigate to explore */}
        <motion.button
          className={styles.exploreCta}
          onClick={handleExplore}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          이 지역 광고 탐색하기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
