'use client';

import { useEffect, useRef, useState } from 'react';
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
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString('ko-KR');
  return String(n);
}

export default function StatCard({ label, value, change, history, color = '#D97706', delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

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
