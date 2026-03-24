'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { motion, useInView } from 'framer-motion';
import styles from './TrendDashboard.module.css';

interface StatCardProps {
  label: string;
  value: number;
  change: number;
  history: number[];
  color?: string;
  delay?: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return n.toLocaleString('ko-KR');
  if (n >= 1_000) return n.toLocaleString('ko-KR');
  return String(n);
}

export default function StatCard({ label, value, change, history, color = '#D97706', delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  const liveRef = useRef(value);

  // Phase 1: 초기 카운트업 애니메이션
  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    }
    const timer = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  // Phase 2: 실시간 틱 — 2~5초마다 소량 증가
  useEffect(() => {
    if (!isInView) return;
    // 카운트업 완료 후 시작
    const startDelay = 1200 + delay * 1000 + 500;
    const timeout = setTimeout(() => {
      liveRef.current = value;
      const tick = () => {
        // 값 크기에 비례한 랜덤 증분
        const base = liveRef.current;
        let increment: number;
        if (base >= 1_000_000) increment = Math.floor(Math.random() * 300) + 50;
        else if (base >= 1_000) increment = Math.floor(Math.random() * 3) + 1;
        else increment = Math.random() < 0.4 ? 1 : 0;

        if (increment > 0) {
          liveRef.current += increment;
          setDisplayValue(liveRef.current);
        }
      };
      // 2~4초 랜덤 간격
      const run = () => {
        tick();
        const next = 2000 + Math.random() * 2000;
        intervalRef.current = window.setTimeout(run, next);
      };
      run();
    }, startDelay);

    const intervalRef: { current: number | null } = { current: null };
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isInView, value, delay]);

  const chartData = history.map((v, i) => ({ day: i, value: v }));
  const isUp = change > 0;

  return (
    <motion.div
      ref={ref}
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{formatNumber(displayValue)}</div>
      <div className={`${styles.statChange} ${isUp ? styles.up : styles.down}`}>
        {isUp ? '↑' : '↓'} {Math.abs(change)}%
      </div>
      <div className={styles.sparklineWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#spark-${label})`}
              dot={false}
              isAnimationActive={isInView}
              animationDuration={1000}
              animationBegin={delay * 1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
