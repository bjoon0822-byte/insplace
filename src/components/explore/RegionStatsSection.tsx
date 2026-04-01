'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/types';
import { t } from '@/i18n/request';
import { getAllRegionStats } from '@/data/region-context';
import { formatLargeNumber } from '@/utils/format';
import RegionStatCard from './RegionStatCard';
import styles from './RegionStatsSection.module.css';

interface Props {
  locale: Locale;
  messages: Record<string, unknown>;
}

/** Seoul map region marker coordinates (%) */
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

export default function RegionStatsSection({ locale, messages }: Props) {
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
              {t(messages, 'region.selectPrompt')}
            </motion.p>
          </div>

          {/* Mini map */}
          <div className={styles.mapContainer}>
            <div className={styles.mapBg}>
              {/* Seoul outline — based on actual administrative boundary */}
              <svg viewBox="0 0 200 160" className={styles.mapSvg}>
                <defs>
                  <radialGradient id="seoulGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(217,119,6,0.06)" />
                    <stop offset="100%" stopColor="rgba(217,119,6,0)" />
                  </radialGradient>
                </defs>
                {/* Glow fill */}
                <path
                  d="M32,88 L38,78 L46,66 L52,54 L56,46 L62,52 L68,40 L76,30 L82,28 L88,34 L94,28 L100,30 L106,34 L112,26 L120,22 L128,26 L136,34 L144,44 L152,54 L160,64 L166,72 L172,82 L174,90 L170,98 L162,106 L152,112 L140,116 L128,118 L116,118 L104,116 L92,114 L80,112 L68,108 L56,104 L44,98 L36,94 Z"
                  fill="url(#seoulGlow)"
                />
                {/* Seoul city boundary — 북쪽 산맥 들쭉날쭉, 남쪽 매끄럽게 */}
                <path
                  d="M32,88 L38,78 L46,66 L52,54 L56,46 L62,52 L68,40 L76,30 L82,28 L88,34 L94,28 L100,30 L106,34 L112,26 L120,22 L128,26 L136,34 L144,44 L152,54 L160,64 L166,72 L172,82 C174,88 174,94 170,98 C166,104 158,110 152,112 C144,115 136,117 128,118 C120,119 112,119 104,116 C96,115 88,114 80,112 C72,110 64,108 56,104 C48,100 40,96 36,94 C33,92 32,90 32,88 Z"
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                {/* Han River — 서에서 동으로 흐르는 한강 */}
                <path
                  d="M32,90 Q60,84 100,87 Q140,90 174,84"
                  fill="none"
                  stroke="rgba(217,119,6,0.18)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />
                {/* 한강 라벨 */}
                <text x="100" y="94" textAnchor="middle" fill="rgba(217,119,6,0.12)" fontSize="5" fontWeight="600" letterSpacing="2">HAN RIVER</text>
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
                    <span className={styles.tooltipValue}>{formatLargeNumber(hovered.statistics.dailyVisitors, locale)}{t(messages, 'region.perDay')}</span>
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
              messages={messages}
              locale={locale}
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
              <p className={styles.otherCitiesDesc}>{t(messages, 'region.otherCities')}</p>
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
                  messages={messages}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
