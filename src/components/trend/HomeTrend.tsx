'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TrendItem } from '@/types';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { motion, useInView } from 'framer-motion';
import { t } from '@/i18n/request';
import styles from './HomeTrend.module.css';

interface HomeTrendProps {
  celebTrend: TrendItem[];
  adTrend: TrendItem[];
  eventTrend: TrendItem[];
  locale: string;
  labels: {
    sectionTitle: string;
    sectionDesc: string;
    celebRank: string;
    adRank: string;
    eventRank: string;
    viewMore: string;
  };
  messages: Record<string, unknown>;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 10_000).toFixed(0)}만`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString('ko-KR');
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  const liveRef = useRef(value);

  // Phase 1: 초기 카운트업
  useEffect(() => {
    if (!isInView) return;
    const duration = 1000;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }
    const timer = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  // Phase 2: 실시간 틱 — 카운트업 후 2~4초마다 소량 증가
  useEffect(() => {
    if (!isInView) return;
    const startDelay = 1000 + delay * 1000 + 500;
    const timeoutId = setTimeout(() => {
      liveRef.current = value;
      const run = () => {
        const base = liveRef.current;
        let inc: number;
        if (base >= 1_000_000) inc = Math.floor(Math.random() * 200) + 30;
        else if (base >= 1_000) inc = Math.floor(Math.random() * 3) + 1;
        else inc = Math.random() < 0.3 ? 1 : 0;
        if (inc > 0) {
          liveRef.current += inc;
          setDisplay(liveRef.current);
        }
        tickRef.current = window.setTimeout(run, 2000 + Math.random() * 2000);
      };
      run();
    }, startDelay);
    const tickRef: { current: number | null } = { current: null };
    return () => {
      clearTimeout(timeoutId);
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [isInView, value, delay]);

  return <span ref={ref}>{formatCount(display)}</span>;
}

function RankItem({ item, index, unit }: { item: TrendItem; index: number; unit?: string }) {
  return (
    <motion.div
      className={styles.rankItem}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className={`${styles.rankNum} ${item.rank <= 3 ? styles.top : ''}`}>
        {item.rank}
      </div>
      <div className={styles.rankBody}>
        <div className={styles.rankNameRow}>
          <span className={styles.rankName}>{item.name}</span>
          <span className={`${styles.rankChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : styles.same}`}>
            {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
          </span>
        </div>
        <div className={styles.rankBarRow}>
          <div className={styles.rankBar}>
            <motion.div
              className={styles.rankBarFill}
              initial={{ width: 0 }}
              whileInView={{ width: `${item.percentage ?? 0}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className={styles.rankCount}>
            <AnimatedNumber value={item.count} delay={0.1 + index * 0.05} />
            {unit}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeTrend({ celebTrend, adTrend, eventTrend, locale, labels, messages }: HomeTrendProps) {
  const DAYS = [
    t(messages, 'trend.dayMon'), t(messages, 'trend.dayTue'), t(messages, 'trend.dayWed'),
    t(messages, 'trend.dayThu'), t(messages, 'trend.dayFri'), t(messages, 'trend.daySat'),
    t(messages, 'trend.daySun'),
  ];

  const celebChartData = DAYS.map((day, i) => {
    const point: Record<string, string | number> = { day };
    celebTrend.slice(0, 3).forEach((item) => {
      point[item.name] = item.history?.[i] ?? 0;
    });
    return point;
  });

  // 광고역 바 차트 데이터
  const adBarData = adTrend.map((item) => ({
    name: item.name.replace(/역$/, ''),
    count: item.count,
  }));

  const colors = ['#D97706', '#F59E0B', '#FBBF24'];

  return (
    <section className={styles.trendSection}>
      {/* Ambient gradient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className={styles.eyebrow}>
              <span className={styles.liveDot} />
              TRENDING
            </div>
            <h2 className={styles.title}>{labels.sectionTitle}</h2>
            <p className={styles.subtitle}>{labels.sectionDesc}</p>
          </div>
          <Link href={`/${locale}/trend`} className={styles.viewAll}>
            {labels.viewMore} →
          </Link>
        </motion.div>

        {/* 통계 바 */}
        <motion.div
          className={styles.statsBar}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{t(messages, 'trend.totalSearch')}</span>
            <span className={styles.statValue}><AnimatedNumber value={8247391} /></span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{t(messages, 'trend.adExecution')}</span>
            <span className={styles.statValue}><AnimatedNumber value={1407} delay={0.05} /></span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{t(messages, 'trend.events')}</span>
            <span className={styles.statValue}><AnimatedNumber value={211} delay={0.1} /></span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{t(messages, 'trend.activeUsers')}</span>
            <span className={styles.statValue}><AnimatedNumber value={3842} delay={0.15} /></span>
          </div>
        </motion.div>

        {/* 벤토 그리드 */}
        <div className={styles.bentoGrid}>
          {/* 셀럽 랭킹 — 큰 카드 */}
          <motion.div
            className={`${styles.card} ${styles.cardLarge}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h3 className={styles.cardTitle}>
              <span>🔥</span> {labels.celebRank}
              <span className={styles.badge}>TOP 5</span>
            </h3>
            {celebTrend.map((item, i) => (
              <RankItem key={item.id} item={item} index={i} />
            ))}
          </motion.div>

          {/* 셀럽 검색량 차트 */}
          <motion.div
            className={`${styles.card} ${styles.cardChart}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className={styles.cardTitle}>
              <span>📈</span> {t(messages, 'trend.searchTrend')}
              <span className={styles.badge}>7일</span>
            </h3>
            <div className={styles.chartLegend}>
              {celebTrend.slice(0, 3).map((item, i) => (
                <div key={item.id} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: colors[i] }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={celebChartData} margin={{ top: 8, right: 4, left: -4, bottom: 0 }}>
                  <defs>
                    {celebTrend.slice(0, 3).map((item, i) => (
                      <linearGradient key={item.id} id={`home-area-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors[i]} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={colors[i]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  {celebTrend.slice(0, 3).map((item, i) => (
                    <Area
                      key={item.id}
                      type="monotone"
                      dataKey={item.name}
                      stroke={colors[i]}
                      strokeWidth={2}
                      fill={`url(#home-area-${item.id})`}
                      dot={false}
                      animationDuration={1200}
                      animationBegin={i * 200}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 광고역 랭킹 */}
          <motion.div
            className={`${styles.card} ${styles.cardAd}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className={styles.cardTitle}>
              <span>📍</span> {labels.adRank}
              <span className={styles.badge}>TOP 5</span>
            </h3>
            {adTrend.map((item, i) => (
              <RankItem key={item.id} item={item} index={i} unit={t(messages, 'trend.unit')} />
            ))}
          </motion.div>

          {/* 광고역 바 차트 */}
          <motion.div
            className={`${styles.card} ${styles.cardBarChart}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={styles.cardTitle}>
              <span>📊</span> {t(messages, 'trend.adCount')}
              <span className={styles.badge}>{t(messages, 'trend.thisMonth')}</span>
            </h3>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adBarData} margin={{ top: 8, right: 4, left: -4, bottom: 0 }} barCategoryGap="25%">
                  <defs>
                    <linearGradient id="homeBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D97706" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#D97706" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="count" fill="url(#homeBarGrad)" radius={[4, 4, 0, 0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 이벤트 카드 — 풀 와이드 */}
          <motion.div
            className={`${styles.card} ${styles.cardEvents}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h3 className={styles.cardTitle}>
              <span>🎉</span> {labels.eventRank}
              <span className={styles.badge}>TOP 5</span>
            </h3>
            <div className={styles.eventRow}>
              {eventTrend.map((item) => {
                const sparkData = (item.history ?? []).map((v, d) => ({ d, v }));
                return (
                  <div key={item.id} className={styles.eventItem}>
                    <div className={styles.eventRank}>#{item.rank}</div>
                    <div className={styles.eventName}>{item.name}</div>
                    <div className={styles.eventSpark}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData}>
                          <defs>
                            <linearGradient id={`home-evt-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#D97706" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke="#D97706" strokeWidth={1.5} fill={`url(#home-evt-${item.id})`} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={styles.eventCount}>{item.count}{t(messages, 'trend.unit')}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
