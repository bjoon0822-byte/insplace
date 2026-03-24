'use client';

import { TrendItem } from '@/types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import TrendRankList from './TrendRankList';
import { TrendAreaChart, TrendBarChart } from './TrendChart';
import styles from './TrendDashboard.module.css';

interface TrendStats {
  totalSearches: { value: number; change: number; history: number[] };
  totalAds: { value: number; change: number; history: number[] };
  totalEvents: { value: number; change: number; history: number[] };
  activeUsers: { value: number; change: number; history: number[] };
  lastUpdated: string;
}

interface TrendDashboardProps {
  celebTrend: TrendItem[];
  adTrend: TrendItem[];
  eventTrend: TrendItem[];
  stats: TrendStats;
  labels: {
    celebRank: string;
    adRank: string;
    eventRank: string;
  };
}

export default function TrendDashboard({ celebTrend, adTrend, eventTrend, stats, labels }: TrendDashboardProps) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardInner}>
      {/* 실시간 인디케이터 */}
      <div className={styles.liveBar}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          LIVE
        </div>
        <span className={styles.lastUpdated}>{stats.lastUpdated} 업데이트</span>
      </div>

      {/* 통계 카드 4개 */}
      <div className={styles.statsGrid}>
        <StatCard label="총 검색량" value={stats.totalSearches.value} change={stats.totalSearches.change} history={stats.totalSearches.history} delay={0} />
        <StatCard label="총 광고" value={stats.totalAds.value} change={stats.totalAds.change} history={stats.totalAds.history} color="#F59E0B" delay={0.08} />
        <StatCard label="이벤트" value={stats.totalEvents.value} change={stats.totalEvents.change} history={stats.totalEvents.history} color="#34D399" delay={0.16} />
        <StatCard label="활성 유저" value={stats.activeUsers.value} change={stats.activeUsers.change} history={stats.activeUsers.history} color="#60A5FA" delay={0.24} />
      </div>

      {/* 셀럽 트렌드: 리스트 + AreaChart */}
      <div className={styles.sectionRow}>
        <motion.div
          className={styles.sectionCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={styles.sectionCardTitle}>
            <span>🔥</span>
            {labels.celebRank}
            <span className={styles.sectionCardBadge}>TOP 5</span>
          </h3>
          <TrendRankList items={celebTrend} />
        </motion.div>

        <motion.div
          className={styles.sectionCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className={styles.sectionCardTitle}>
            <span>📈</span>
            검색량 추이
            <span className={styles.sectionCardBadge}>7일</span>
          </h3>
          <TrendAreaChart items={celebTrend} />
        </motion.div>
      </div>

      {/* 광고역 트렌드: 리스트 + BarChart */}
      <div className={styles.sectionRow}>
        <motion.div
          className={styles.sectionCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <h3 className={styles.sectionCardTitle}>
            <span>📍</span>
            {labels.adRank}
            <span className={styles.sectionCardBadge}>TOP 5</span>
          </h3>
          <TrendRankList items={adTrend} unit="건" />
        </motion.div>

        <motion.div
          className={styles.sectionCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className={styles.sectionCardTitle}>
            <span>📊</span>
            광고 건수 비교
            <span className={styles.sectionCardBadge}>이번 달</span>
          </h3>
          <TrendBarChart items={adTrend} />
        </motion.div>
      </div>

      {/* 이벤트 트렌드: 풀 와이드 카드 */}
      <motion.div
        className={styles.eventSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className={styles.sectionCardTitle}>
          <span>🎉</span>
          {labels.eventRank}
          <span className={styles.sectionCardBadge}>TOP 5</span>
        </h3>
        <div className={styles.eventGrid}>
          {eventTrend.map((item, i) => {
            const chartData = (item.history ?? []).map((v, d) => ({ d, v }));
            return (
              <motion.div
                key={item.id}
                className={styles.eventCard}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className={styles.eventRank}>#{item.rank}</div>
                <div className={styles.eventName}>{item.name}</div>
                <div className={styles.eventCount}>{item.count}건</div>
                <div className={styles.eventSparkline}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`evt-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D97706" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#D97706" strokeWidth={1.5} fill={`url(#evt-${item.id})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className={`${styles.eventChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : styles.same}`}>
                  {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </div>
    </div>
  );
}
