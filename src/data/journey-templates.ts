// 팬 여정 패키지 템플릿
// 왜: 챗봇이 Step 3에서 광고→대관→굿즈 연결 동선을 추천할 때 사용

import type { AdPurpose, BudgetTier, ProductCategory } from '@/types';

export interface JourneyStepTemplate {
  order: number;
  role: 'attention' | 'gathering' | 'memento';
  label: string;
  category: ProductCategory;
  productIds: string[];
  note: string;
}

export interface JourneyTemplate {
  id: string;
  name: string;
  purpose: AdPurpose;
  region: string;
  budgetTier: BudgetTier;
  steps: JourneyStepTemplate[];
  totalEstimate: [number, number];
  description: string;
}

export const journeyTemplates: JourneyTemplate[] = [
  {
    id: 'journey-001',
    name: '홍대 생일 가성비 패키지',
    purpose: 'birthday',
    region: '서울-마포',
    budgetTier: 'budget',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-006'],
        note: '합정역 CM보드로 유동인구 52,958명에게 생일 광고 노출. 가성비 최고 매체',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-003', 'venue-002'],
        note: '카페 랄레는 음료 구매 조건 무료 대관 가능. 디어 마이 디어는 스탬프투어+가챠 등 팬 이벤트 특화',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-001', 'goods-004'],
        note: '홀로그램 포토카드(100장 5만원)+컵홀더(500장 6만원)로 방문 팬 기념품 제공',
      },
    ],
    totalEstimate: [488300, 698300],
    description: '50만원대로 가능한 알찬 생일 이벤트. 합정역 CM보드 광고 + 홍대 카페 대관 + 포토카드&컵홀더 굿즈 세트',
  },
  {
    id: 'journey-002',
    name: '홍대 생일 프리미엄 패키지',
    purpose: 'birthday',
    region: '서울-마포',
    budgetTier: 'standard',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-001', 'ad-011'],
        note: '홍대입구역 디지털 사이니지(영상+사운드) + 역내 7개소 아트 래핑으로 압도적 노출',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-004', 'venue-001'],
        note: "B'DAY 전용 파티룸(50명 수용)에서 럭키드로우+랜덤선물 이벤트",
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-001', 'goods-003', 'goods-004'],
        note: '포토카드 + 레터링 케이크 + 컵홀더 풀세트로 완벽한 생일파티',
      },
    ],
    totalEstimate: [3625000, 4025000],
    description: '홍대 최대 규모 생일 이벤트. 역 내 디지털 광고 + 전용 파티룸 + 풀 굿즈 세트',
  },
  {
    id: 'journey-003',
    name: '강남 데뷔/기념일 패키지',
    purpose: 'debut',
    region: '서울-강남',
    budgetTier: 'standard',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-005', 'ad-012'],
        note: '강남역 맥스비전 세트 + 미디어월로 환승통로 유동인구 44,618명에게 노출',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-009'],
        note: '강남역 도보 5분 카페 드림에서 빔프로젝터+음향시스템으로 데뷔 영상 상영회',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-001', 'goods-005'],
        note: '홀로그램 포토카드 + 블루밍 플라워 박스로 기념일 분위기 연출',
      },
    ],
    totalEstimate: [6070000, 6520000],
    description: '강남 환승통로 대형 LED + 프리미엄 카페 상영회 + 기념 굿즈',
  },
  {
    id: 'journey-004',
    name: '성수 콘서트 응원 패키지',
    purpose: 'concert',
    region: '서울-성동',
    budgetTier: 'premium',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-008'],
        note: '성수역 출구 LED 빌보드로 핫플레이스 유동인구에게 콘서트 응원 광고 노출',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-008', 'venue-005'],
        note: '어라운드 성수 루프탑 카페 또는 오디너리 아카이브 갤러리에서 콘서트 전 팬 모임',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-002', 'goods-001'],
        note: '반사 슬로건(콘서트장 필수) + 포토카드로 현장 응원 키트 제공',
      },
    ],
    totalEstimate: [13700000, 14200000],
    description: '성수 LED 빌보드 + 루프탑 팬모임 + 콘서트 응원 굿즈 키트',
  },
  {
    id: 'journey-005',
    name: '잠실 콘서트 뒤풀이 패키지',
    purpose: 'concert',
    region: '서울-송파',
    budgetTier: 'premium',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-001'],
        note: '공연장 최인접 역(잠실역/종합운동장역) 디지털 사이니지로 콘서트 전후 팬들에게 노출',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-010'],
        note: '잠실 파티룸 나비(70명 수용)에서 대형 스크린 + LED 조명 + 케이터링으로 대규모 뒤풀이',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-002', 'goods-001'],
        note: '반사 슬로건 + 포토카드 세트로 콘서트 기념 굿즈 제공',
      },
    ],
    totalEstimate: [1400000, 1900000],
    description: '콘서트 후 잠실 대형 파티룸에서 LED 뒤풀이 + 응원 굿즈',
  },
  {
    id: 'journey-006',
    name: '혜화 드라마/뮤지컬 응원 패키지',
    purpose: 'drama',
    region: '서울-종로',
    budgetTier: 'standard',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-010'],
        note: '혜화역 조명 광고(24시간 상시 노출)로 대학로 공연 관객에게 지속 노출',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-001'],
        note: '인근 감성 카페에서 공연 전후 팬 모임 및 포토타임',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-005', 'goods-001'],
        note: '블루밍 플라워 박스(출연 축하용) + 포토카드로 응원 선물 세트',
      },
    ],
    totalEstimate: [5055000, 5405000],
    description: '혜화역 24시간 조명 광고 + 대학로 카페 모임 + 축하 플라워&포토카드',
  },
  {
    id: 'journey-007',
    name: '소규모 온라인 중심 패키지',
    purpose: 'birthday',
    region: '서울-마포',
    budgetTier: 'budget',
    steps: [
      {
        order: 1,
        role: 'attention',
        label: '관심 끌기',
        category: 'ad',
        productIds: ['ad-006'],
        note: '합정역 CM보드 하나로 가성비 있게 생일 광고 노출. 인증샷 포인트',
      },
      {
        order: 2,
        role: 'gathering',
        label: '팬 모임',
        category: 'venue',
        productIds: ['venue-003'],
        note: '카페 랄레(음료 조건 무료 대관)에서 소규모 팬 모임. 25명 수용',
      },
      {
        order: 3,
        role: 'memento',
        label: '기념품',
        category: 'goods',
        productIds: ['goods-004'],
        note: '컵홀더 500장(6만원)으로 카페 이벤트 분위기 연출',
      },
    ],
    totalEstimate: [438300, 638300],
    description: '40만원대 미니멀 패키지. CM보드 1개 + 무료 대관 카페 + 컵홀더',
  },
];

/** 조건에 맞는 여정 템플릿 검색 */
export function findJourneyTemplates(params: {
  region?: string;
  purpose?: AdPurpose;
  budgetTier?: BudgetTier;
}): JourneyTemplate[] {
  return journeyTemplates.filter((t) => {
    if (params.region && t.region !== params.region) return false;
    if (params.purpose && t.purpose !== params.purpose) return false;
    if (params.budgetTier && t.budgetTier !== params.budgetTier) return false;
    return true;
  });
}
