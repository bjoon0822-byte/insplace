import type { ParsedIntent, AdPurpose, ProductCategory } from '@/types';

/** 지역명 → 정규화된 지역 코드 */
const REGION_KEYWORDS: Record<string, string[]> = {
  '서울-마포': ['홍대', '홍대입구', '합정', '마포', '상수', '연남', '서교', '망원'],
  '서울-강남': ['강남', '강남역', '신사', '압구정', '삼성', '선릉', '역삼'],
  '서울-성동': ['성수', '성수역', '왕십리', '건대', '성동'],
  '서울-종로': ['혜화', '대학로', '광화문', '종로', '인사동'],
  '대구': ['대구', '동성로'],
  '부산': ['부산', '해운대', '서면', '광안리'],
};

/** 목적 키워드 사전 */
const PURPOSE_KEYWORDS: Record<AdPurpose, string[]> = {
  birthday: ['생일', '생일잔치', '생일광고', '탄생일', '생일축하', '생카'],
  debut: ['데뷔', '데뷔기념', '데뷔일', '데뷔축하'],
  comeback: ['컴백', '신곡', '앨범', '발매', '컴백축하'],
  drama: ['드라마', '영화', '촬영지', '출연', '방영'],
  concert: ['콘서트', '투어', '공연', '팬미팅', '라이브'],
  anniversary: ['기념일', '주년', '멤버십', '기념'],
  graduation: ['졸업', '입학'],
  general: ['광고', '홍보', '프로모션'],
};

/** 예산 추출 패턴 */
const BUDGET_PATTERNS: Array<{ regex: RegExp; multiplier: number }> = [
  { regex: /(\d+)\s*천만\s*원/, multiplier: 10_000_000 },
  { regex: /(\d+)\s*백만\s*원/, multiplier: 1_000_000 },
  { regex: /(\d+)\s*만\s*원/, multiplier: 10_000 },
  { regex: /(\d[\d,]*)\s*원/, multiplier: 1 },
];

/** 기간 추출 패턴 */
const DURATION_PATTERNS: Array<{ regex: RegExp; toDays: (n: number) => number }> = [
  { regex: /(\d+)\s*개월/, toDays: (n) => n * 30 },
  { regex: /(\d+)\s*주/, toDays: (n) => n * 7 },
  { regex: /(\d+)\s*일\s*(동안|간|정도)?/, toDays: (n) => n },
];

/** 상품 유형 키워드 */
const PRODUCT_TYPE_KEYWORDS: Record<ProductCategory, string[]> = {
  ad: ['광고', '사이니지', '전광판', 'LED', '라이트박스', '조명', '빌보드', 'CM보드', '미디어'],
  venue: ['카페', '대관', '장소', '공간', '파티룸', '카페대관', '생일카페', '갤러리'],
  goods: ['굿즈', '포토카드', '트레카', '슬로건', '케이크', '컵홀더', '꽃다발', '플라워'],
  popup: ['팝업', '팝업스토어', '이벤트'],
};

/**
 * 한국어 자연어 프롬프트에서 구조화된 의도를 추출한다.
 * LLM 없이 키워드 사전 + 정규식만 사용.
 * 나중에 LLM으로 교체할 때 이 함수의 시그니처만 유지하면 된다.
 */
export function parseIntent(input: string): ParsedIntent {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 지역 추출
  const regions: string[] = [];
  for (const [normalized, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      regions.push(normalized);
    }
  }

  // 목적 추출
  const purposes: AdPurpose[] = [];
  for (const [purpose, keywords] of Object.entries(PURPOSE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      purposes.push(purpose as AdPurpose);
    }
  }

  // 예산 추출
  let budgetMax: number | null = null;
  for (const { regex, multiplier } of BUDGET_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      const raw = match[1].replace(/,/g, '');
      budgetMax = parseInt(raw, 10) * multiplier;
      break;
    }
  }

  // 기간 추출
  let duration: number | null = null;
  for (const { regex, toDays } of DURATION_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      duration = toDays(parseInt(match[1], 10));
      break;
    }
  }

  // 상품 유형 추출
  const productTypes: ProductCategory[] = [];
  for (const [type, keywords] of Object.entries(PRODUCT_TYPE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      productTypes.push(type as ProductCategory);
    }
  }

  // 기본값: 상품 유형 미지정 시 광고 + 대관
  if (productTypes.length === 0) {
    productTypes.push('ad', 'venue');
  }

  // 키워드 (공백 분리)
  const keywords = text
    .split(/[\s,.\-~!?]+/)
    .filter((w) => w.length >= 2);

  return {
    purposes: purposes.length > 0 ? purposes : ['general'],
    regions,
    budgetMax,
    duration,
    productTypes,
    keywords,
    artistName: null,
  };
}
