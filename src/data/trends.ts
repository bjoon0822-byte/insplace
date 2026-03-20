import { TrendItem } from '@/types';

// 실제 덕플레이스 트렌드 데이터 기반 (2026.03 기준)
export const celebTrend: TrendItem[] = [
  { rank: 1, name: 'NCT WISH', count: 2221945, change: 0 },
  { rank: 2, name: '원빈 (RIIZE)', count: 2059008, change: 2 },
  { rank: 3, name: '범규 (TXT)', count: 868018, change: -1 },
  { rank: 4, name: '앤톤 (RIIZE)', count: 841605, change: 1 },
  { rank: 5, name: '신룡 (Alpha Drive One)', count: 714424, change: -2 },
];

export const adTrend: TrendItem[] = [
  { rank: 1, name: '홍대입구역', count: 412, change: 0 },
  { rank: 2, name: '합정역', count: 387, change: 1 },
  { rank: 3, name: '강남역', count: 298, change: -1 },
  { rank: 4, name: '성수역', count: 176, change: 3 },
  { rank: 5, name: '혜화역', count: 134, change: 0 },
];

export const eventTrend: TrendItem[] = [
  { rank: 1, name: '원빈 (RIIZE)', count: 63, change: 0 },
  { rank: 2, name: '앤톤 (RIIZE)', count: 35, change: 2 },
  { rank: 3, name: '은석 (RIIZE)', count: 33, change: -1 },
  { rank: 4, name: '신룡', count: 33, change: 1 },
  { rank: 5, name: 'NCT WISH', count: 47, change: -2 },
];
