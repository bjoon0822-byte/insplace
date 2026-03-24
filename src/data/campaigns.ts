export interface Campaign {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  contributorCount: number;
  adProductId: string | null;
  status: 'active' | 'funded' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  proofImages: string[];
  createdBy: string;
}

export const campaigns: Campaign[] = [
  {
    id: 'campaign-001',
    artistId: 'artist-001',
    artistName: '지민',
    title: '지민 생일 강남역 전광판 광고',
    description: '지민의 생일을 맞아 강남역 대형 전광판에 축하 광고를 집행합니다! 팬 여러분의 참여를 기다립니다.',
    targetAmount: 3000000,
    currentAmount: 2145000,
    contributorCount: 127,
    adProductId: 'ad-001',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-04-10',
    proofImages: [],
    createdBy: '지민이최고',
  },
  {
    id: 'campaign-002',
    artistId: 'artist-004',
    artistName: '원영',
    title: '원영 데뷔 기념 삼성역 광고',
    description: 'IVE 원영의 데뷔 기념일을 축하하는 삼성역 라이트박스 광고입니다.',
    targetAmount: 1500000,
    currentAmount: 1500000,
    contributorCount: 89,
    adProductId: 'ad-003',
    status: 'funded',
    startDate: '2026-02-15',
    endDate: '2026-03-30',
    proofImages: [],
    createdBy: '다이브투원영',
  },
  {
    id: 'campaign-003',
    artistId: 'artist-006',
    artistName: '해린',
    title: '해린 생일 카페 이벤트',
    description: 'NewJeans 해린의 생일을 맞아 홍대 카페에서 커핑 이벤트를 진행합니다.',
    targetAmount: 800000,
    currentAmount: 340000,
    contributorCount: 42,
    adProductId: null,
    status: 'active',
    startDate: '2026-03-10',
    endDate: '2026-05-10',
    proofImages: [],
    createdBy: '뉴진스해린팬',
  },
  {
    id: 'campaign-004',
    artistId: 'artist-009',
    artistName: '정국',
    title: '정국 솔로 앨범 기념 홍대입구역 광고',
    description: 'BTS 정국의 새 솔로 앨범 발매를 축하하는 대형 광고입니다.',
    targetAmount: 5000000,
    currentAmount: 5000000,
    contributorCount: 312,
    adProductId: 'ad-002',
    status: 'completed',
    startDate: '2025-12-01',
    endDate: '2026-01-15',
    proofImages: ['/images/proof/placeholder.webp'],
    createdBy: '아미97',
  },
];
