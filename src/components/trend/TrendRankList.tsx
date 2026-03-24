'use client';

import { TrendItem } from '@/types';
import { motion } from 'framer-motion';
import styles from './TrendDashboard.module.css';

interface TrendRankListProps {
  items: TrendItem[];
  unit?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 10_000).toLocaleString('ko-KR')}만`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString('ko-KR');
}

export default function TrendRankList({ items, unit = '' }: TrendRankListProps) {
  return (
    <div>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className={styles.rankItem}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
        >
          <div className={`${styles.rankNumber} ${item.rank <= 3 ? styles.top : ''}`}>
            {item.rank}
          </div>
          <div className={styles.rankInfo}>
            <div className={styles.rankName}>{item.name}</div>
            <div className={styles.rankBar}>
              <motion.div
                className={styles.rankBarFill}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.percentage ?? 0}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
          <div className={styles.rankCount}>
            {formatCount(item.count)}{unit}
          </div>
          <div className={`${styles.rankChange} ${item.change > 0 ? styles.up : item.change < 0 ? styles.down : styles.same}`}>
            {item.change > 0 ? `▲${item.change}` : item.change < 0 ? `▼${Math.abs(item.change)}` : '—'}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
