'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/types';
import { getAllRegionStats } from '@/data/region-context';
import { formatLargeNumber } from '@/utils/format';
import RegionStatCard from './RegionStatCard';
import styles from './RegionStatsSection.module.css';

interface Props {
  locale: Locale;
}

/** 서울 지도 위 지역 마커 좌표 (%) */
const MAP_PINS: Record<string, { x: number; y: number }> = {
  '서울-마포': { x: 28, y: 42 },
  '서울-강남': { x: 55, y: 68 },
  '서울-성동': { x: 56, y: 44 },
  '서울-송파': { x: 74, y: 58 },
  '서울-종로': { x: 44, y: 30 },
  '서울-중구': { x: 48, y: 42 },
  '서울-영등포': { x: 32, y: 62 },
  '서울-용산': { x: 40, y: 52 },
  '서울-광진': { x: 66, y: 42 },
  '서울-강남2': { x: 64, y: 62 },
};

export default function RegionStatsSection({ locale }: Props) {
  const router = useRouter();
  const allRegions = getAllRegionStats();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // 서울 vs 비서울 분리 + 순위순 정렬
  const seoulRegions = useMemo(
    () => [...allRegions]
      .filter((r) => r.id.startsWith('서울-'))
      .sort((a, b) => a.statistics.subwayRank - b.statistics.subwayRank),
    [allRegions],
  );

  const otherRegions = useMemo(
    () => allRegions.filter((r) => !r.id.startsWith('서울-')),
    [allRegions],
  );

  // 맵 핀은 서울 지역만
  const regions = seoulRegions;

  const hovered = hoveredRegion
    ? regions.find((r) => r.id === hoveredRegion) ?? null
    : null;

  const handleSelect = useCallback((regionId: string) => {
    // URL 업데이트 + 위저드 섹션으로 스크롤
    router.push(`/${locale}/explore?region=${encodeURIComponent(regionId)}&step=2`, { scroll: false });
    setTimeout(() => {
      document.getElementById('explorer-wizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [router, locale]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Hero header — Seoul map overview */}
        <div className={styles.heroHeader}>
          <div className={styles.heroLeft}>
            <motion.div
              className={styles.sectionTag}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className={styles.liveDot} />
              FLOATING POPULATION DATA
            </motion.div>

            <motion.h2
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Seoul
            </motion.h2>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Floating Population Regions <span className={styles.heroAccent}>TOP{regions.length}</span>
            </motion.p>
            <motion.p
              className={styles.heroDesc}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              지역을 선택하면 맞춤 광고 탐색이 시작됩니다
            </motion.p>
          </div>

          {/* Mini map */}
          <div className={styles.mapContainer}>
            <div className={styles.mapBg}>
              {/* Seoul outline — jagged north (mountains), smooth south */}
              <svg viewBox="0 0 200 160" className={styles.mapSvg}>
                {/* Seoul city boundary */}
                <path
                  d="M36,82 L38,72 L42,62 L48,52 L54,44 L58,46 L64,38 L70,34 L76,36 L82,30 L88,32 L94,28 L100,30 L106,26 L112,28 L118,24 L124,26 L130,24 L136,28 L142,32 L148,36 L154,42 L158,50 L162,58 L164,68 L164,80 L162,90 L158,100 L154,110 L148,118 L140,124 L132,128 L124,130 L116,128 L108,130 L100,128 L92,130 L84,128 L76,126 L68,120 L60,114 L52,106 L46,96 L40,88 Z"
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                {/* Han River */}
                <path
                  d="M36,86 Q70,78 100,82 Q130,86 164,78"
                  fill="none"
                  stroke="rgba(217,119,6,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {/* Faint district grid */}
                <line x1="100" y1="28" x2="100" y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 4" />
                <line x1="36" y1="80" x2="164" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 4" />
              </svg>

              {/* Pins */}
              {regions.map((region) => {
                const pin = MAP_PINS[region.id];
                if (!pin) return null;
                const isHovered = hoveredRegion === region.id;
                return (
                  <button
                    key={region.id}
                    className={`${styles.pin} ${isHovered ? styles.pinActive : ''}`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleSelect(region.id)}
                  >
                    <span className={styles.pinHitArea} />
                    <span className={styles.pinDot} />
                    <span className={styles.pinLabel}>{region.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Hover tooltip — follows pin position */}
            <AnimatePresence>
              {hovered && hoveredRegion && MAP_PINS[hoveredRegion] && (
                <motion.div
                  className={styles.tooltip}
                  style={{
                    left: `${MAP_PINS[hoveredRegion].x}%`,
                    top: `${MAP_PINS[hoveredRegion].y}%`,
                  }}
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.tooltipName}>{hovered.name}</div>
                  <div className={styles.tooltipStat}>
                    <span className={styles.tooltipValue}>{formatLargeNumber(hovered.statistics.dailyVisitors)}명</span>
                    <span className={styles.tooltipLabel}>/day</span>
                  </div>
                  <div className={styles.tooltipHighlight}>{hovered.statistics.stationHighlight}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Seoul cards grid */}
        <div className={styles.grid}>
          {seoulRegions.map((region, i) => (
            <RegionStatCard
              key={region.id}
              id={region.id}
              name={region.name}
              statistics={region.statistics}
              highlight={region.highlight}
              peakHours={region.peakHours}
              delay={i * 0.12}
              isActive={hoveredRegion === region.id}
              onClick={handleSelect}
            />
          ))}
        </div>

        {/* Other cities section */}
        {otherRegions.length > 0 && (
          <div className={styles.otherCities}>
            <motion.div
              className={styles.otherCitiesHeader}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.otherCitiesTitle}>Other Cities</h3>
              <p className={styles.otherCitiesDesc}>서울 외 주요 광고 지역</p>
            </motion.div>
            <div className={styles.otherGrid}>
              {otherRegions.map((region, i) => (
                <RegionStatCard
                  key={region.id}
                  id={region.id}
                  name={region.name}
                  statistics={region.statistics}
                  highlight={region.highlight}
                  peakHours={region.peakHours}
                  delay={i * 0.12}
                  isActive={false}
                  onClick={handleSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
