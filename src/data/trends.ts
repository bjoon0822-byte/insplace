import { TrendItem } from '@/types';

// 실제 덕플레이스 트렌드 데이터 기반 (2026.03 기준)
export const celebTrend: TrendItem[] = [
  { rank: 1, id: 'nct-wish', name: 'NCT WISH', count: 2221945, change: 0 },
  { rank: 2, id: 'wonbin', name: '원빈 (RIIZE)', count: 2059008, change: 2 },
  { rank: 3, id: 'beomgyu', name: '범규 (TXT)', count: 868018, change: -1 },
  { rank: 4, id: 'anton', name: '앤톤 (RIIZE)', count: 841605, change: 1 },
  { rank: 5, id: 'xinlong', name: '신룡 (Alpha Drive One)', count: 714424, change: -2 },
];

export const adTrend: TrendItem[] = [
  { rank: 1, id: 'hongdae', name: '홍대입구역', count: 412, change: 0 },
  { rank: 2, id: 'hapjeong', name: '합정역', count: 387, change: 1 },
  { rank: 3, id: 'gangnam', name: '강남역', count: 298, change: -1 },
  { rank: 4, id: 'seongsu', name: '성수역', count: 176, change: 3 },
  { rank: 5, id: 'hyehwa', name: '혜화역', count: 134, change: 0 },
];

export const eventTrend: TrendItem[] = [
  { rank: 1, id: 'wonbin', name: '원빈 (RIIZE)', count: 63, change: 0 },
  { rank: 2, id: 'anton', name: '앤톤 (RIIZE)', count: 35, change: 2 },
  { rank: 3, id: 'eunseok', name: '은석 (RIIZE)', count: 33, change: -1 },
  { rank: 4, id: 'xinlong', name: '신룡', count: 33, change: 1 },
  { rank: 5, id: 'nct-wish', name: 'NCT WISH', count: 47, change: -2 },
];
