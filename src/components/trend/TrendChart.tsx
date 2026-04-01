'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendItem } from '@/types';
import { t } from '@/i18n/request';
import styles from './TrendDashboard.module.css';

interface TrendAreaChartProps {
  items: TrendItem[];
  messages?: Record<string, unknown>;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 10_000).toFixed(0)}만`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString('ko-KR');
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipValue}>
          {p.name}: {formatCompact(p.value)}
        </div>
      ))}
    </div>
  );
}

export function TrendAreaChart({ items, messages = {} }: TrendAreaChartProps) {
  const top3 = items.slice(0, 3);
  const days = [
    t(messages, 'trend.dayMon'), t(messages, 'trend.dayTue'), t(messages, 'trend.dayWed'),
    t(messages, 'trend.dayThu'), t(messages, 'trend.dayFri'), t(messages, 'trend.daySat'),
    t(messages, 'trend.daySun'),
  ];
  const data = days.map((day, i) => {
    const point: Record<string, string | number> = { day };
    top3.forEach((item) => {
      point[item.name] = item.history?.[i] ?? 0;
    });
    return point;
  });

  const colors = ['#D97706', '#F59E0B', '#FBBF24'];

  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            {top3.map((item, i) => (
              <linearGradient key={item.id} id={`area-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[i]} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colors[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
          <Tooltip content={<CustomTooltip />} />
          {top3.map((item, i) => (
            <Area
              key={item.id}
              type="monotone"
              dataKey={item.name}
              stroke={colors[i]}
              strokeWidth={2}
              fill={`url(#area-${item.id})`}
              dot={false}
              animationDuration={1200}
              animationBegin={i * 200}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrendBarChartProps {
  items: TrendItem[];
  messages?: Record<string, unknown>;
}

export function TrendBarChart({ items, messages = {} }: TrendBarChartProps) {
  const data = items.map((item) => ({
    name: item.name.replace(/역$/, ''),
    count: item.count,
  }));

  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="20%">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#D97706" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            name={t(messages, 'trend.adCases')}
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
