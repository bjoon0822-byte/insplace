import { TrendItem } from '@/types';

// 실제 덕플레이스 트렌드 데이터 기반 (2026.03 기준)
export const celebTrend: TrendItem[] = [
  {
    rank: 1, id: 'nct-wish', name: 'NCT WISH', count: 2221945, change: 0,
    history: [1_842_100, 1_910_300, 1_978_500, 2_045_200, 2_112_800, 2_168_400, 2_221_945],
    percentage: 100,
  },
  {
    rank: 2, id: 'wonbin', name: '원빈 (RIIZE)', count: 2059008, change: 2,
    history: [1_620_400, 1_710_200, 1_780_300, 1_860_100, 1_935_600, 1_998_400, 2_059_008],
    percentage: 92.7,
  },
  {
    rank: 3, id: 'beomgyu', name: '범규 (TXT)', count: 868018, change: -1,
    history: [920_300, 905_100, 892_400, 880_200, 875_600, 871_300, 868_018],
    percentage: 39.1,
  },
  {
    rank: 4, id: 'anton', name: '앤톤 (RIIZE)', count: 841605, change: 1,
    history: [710_200, 735_400, 758_100, 782_300, 805_600, 824_200, 841_605],
    percentage: 37.9,
  },
  {
    rank: 5, id: 'xinlong', name: '신룡 (Alpha Drive One)', count: 714424, change: -2,
    history: [780_100, 765_300, 748_200, 738_400, 725_100, 718_600, 714_424],
    percentage: 32.2,
  },
];

export const adTrend: TrendItem[] = [
  {
    rank: 1, id: 'hongdae', name: '홍대입구역', count: 412, change: 0,
    history: [345, 358, 372, 380, 391, 402, 412],
    percentage: 100,
  },
  {
    rank: 2, id: 'hapjeong', name: '합정역', count: 387, change: 1,
    history: [310, 325, 338, 350, 362, 375, 387],
    percentage: 93.9,
  },
  {
    rank: 3, id: 'gangnam', name: '강남역', count: 298, change: -1,
    history: [312, 308, 305, 302, 300, 299, 298],
    percentage: 72.3,
  },
  {
    rank: 4, id: 'seongsu', name: '성수역', count: 176, change: 3,
    history: [98, 112, 128, 140, 155, 168, 176],
    percentage: 42.7,
  },
  {
    rank: 5, id: 'hyehwa', name: '혜화역', count: 134, change: 0,
    history: [120, 122, 125, 128, 130, 132, 134],
    percentage: 32.5,
  },
];

export const eventTrend: TrendItem[] = [
  {
    rank: 1, id: 'wonbin', name: '원빈 (RIIZE)', count: 63, change: 0,
    history: [42, 45, 48, 52, 55, 59, 63],
    percentage: 100,
  },
  {
    rank: 2, id: 'anton', name: '앤톤 (RIIZE)', count: 35, change: 2,
    history: [18, 21, 24, 27, 29, 32, 35],
    percentage: 55.6,
  },
  {
    rank: 3, id: 'eunseok', name: '은석 (RIIZE)', count: 33, change: -1,
    history: [38, 36, 35, 34, 34, 33, 33],
    percentage: 52.4,
  },
  {
    rank: 4, id: 'xinlong', name: '신룡', count: 33, change: 1,
    history: [20, 23, 25, 27, 29, 31, 33],
    percentage: 52.4,
  },
  {
    rank: 5, id: 'nct-wish', name: 'NCT WISH', count: 47, change: -2,
    history: [55, 53, 52, 50, 49, 48, 47],
    percentage: 74.6,
  },
];

// 총 통계 데이터
export const trendStats = {
  totalSearches: { value: 8_247_391, change: 12.3, history: [6_820_100, 7_105_300, 7_392_400, 7_610_200, 7_845_600, 8_048_100, 8_247_391] },
  totalAds:      { value: 1_407, change: 8.7, history: [1_120, 1_165, 1_210, 1_268, 1_320, 1_365, 1_407] },
  totalEvents:   { value: 211, change: 5.2, history: [172, 178, 185, 192, 198, 205, 211] },
  activeUsers:   { value: 3_842, change: 15.1, history: [2_810, 2_980, 3_150, 3_320, 3_480, 3_660, 3_842] },
  lastUpdated: '2026.03.24 15:30',
};
