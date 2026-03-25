import type {
  ParsedIntent,
  RecommendationResult,
  AdProduct,
  Venue,
  GoodsItem,
  AdPurpose,
  ProductCategory,
} from '@/types';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';

/** 목적 한국어 라벨 */
const PURPOSE_LABELS: Record<AdPurpose, string> = {
  birthday: '생일',
  debut: '데뷔',
  comeback: '컴백',
  drama: '드라마',
  concert: '콘서트',
  anniversary: '기념일',
  graduation: '졸업',
  general: '일반',
};

/** 스코어링 가중치 (총 100점) */
const W = {
  region: 30,
  budget: 25,
  purpose: 20,
  availability: 10,
  popularity: 10,
  keyword: 5,
} as const;

function scoreAdProduct(
  ad: AdProduct,
  intent: ParsedIntent,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 지역 일치
  if (intent.regions.length > 0) {
    if (intent.regions.includes(ad.regionNormalized)) {
      score += W.region;
      reasons.push('지역 일치');
    }
  } else {
    score += W.region * 0.5;
  }

  // 예산 범위
  if (intent.budgetMax !== null) {
    if (ad.price <= intent.budgetMax) {
      const ratio = 1 - ad.price / intent.budgetMax;
      score += W.budget * (0.5 + ratio * 0.5);
      reasons.push('예산 범위 내');
    }
  } else {
    score += W.budget * 0.3;
  }

  // 목적 일치
  const overlap = intent.purposes.filter((p) => ad.purposes.includes(p));
  if (overlap.length > 0) {
    score += W.purpose * (overlap.length / intent.purposes.length);
    const labels = overlap.map((p) => PURPOSE_LABELS[p]).join(', ');
    reasons.push(`${labels} 광고`);
  }

  // 예약 가능
  if (ad.availability === 'available') {
    score += W.availability;
    reasons.push('바로 예약 가능');
  } else if (ad.availability === 'busy') {
    score += W.availability * 0.3;
  }

  // 인기도 (유동인구 기준, 최대 60000)
  const viewRatio = Math.min(ad.views / 60000, 1);
  score += W.popularity * viewRatio;

  // 키워드 매치
  const tagHits = ad.tags.filter((tag) =>
    intent.keywords.some((kw) => tag.includes(kw) || kw.includes(tag)),
  );
  if (tagHits.length > 0) {
    score += W.keyword;
  }

  return { score: Math.round(score), reasons };
}

function scoreVenue(
  venue: Venue,
  intent: ParsedIntent,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 지역 일치
  if (intent.regions.length > 0) {
    if (intent.regions.includes(venue.regionNormalized)) {
      score += W.region;
      reasons.push('지역 일치');
    }
  } else {
    score += W.region * 0.5;
  }

  // 예산 범위 (일 대관료 기준)
  if (intent.budgetMax !== null) {
    if (venue.pricePerDay <= intent.budgetMax) {
      const ratio = 1 - venue.pricePerDay / intent.budgetMax;
      score += W.budget * (0.5 + ratio * 0.5);
      reasons.push('예산 범위 내');
    }
  } else {
    score += W.budget * 0.3;
  }

  // 목적 일치
  const overlap = intent.purposes.filter((p) => venue.purposes.includes(p));
  if (overlap.length > 0) {
    score += W.purpose * (overlap.length / intent.purposes.length);
    reasons.push(`${overlap.map((p) => PURPOSE_LABELS[p]).join(', ')} 장소`);
  }

  // 예약 가능
  if (venue.availability === 'available') {
    score += W.availability;
    reasons.push('바로 예약 가능');
  } else if (venue.availability === 'busy') {
    score += W.availability * 0.3;
  }

  // 인기도 (수용 인원 기준, 최대 60)
  const capRatio = Math.min(venue.capacity / 60, 1);
  score += W.popularity * capRatio;

  // 키워드 매치
  const tagHits = venue.tags.filter((tag) =>
    intent.keywords.some((kw) => tag.includes(kw) || kw.includes(tag)),
  );
  if (tagHits.length > 0) {
    score += W.keyword;
  }

  return { score: Math.round(score), reasons };
}

function scoreGoods(
  item: GoodsItem,
  intent: ParsedIntent,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 굿즈는 지역 무관 → 공정 기본 점수
  score += W.region * 0.5;

  // 예산 (개당 가격이므로 비교 기준이 다름 — 공정하게 처리)
  score += W.budget * 0.5;

  // 목적 일치
  const overlap = intent.purposes.filter((p) => item.purposes.includes(p));
  if (overlap.length > 0) {
    score += W.purpose * (overlap.length / intent.purposes.length);
    reasons.push(`${overlap.map((p) => PURPOSE_LABELS[p]).join(', ')} 굿즈`);
  }

  // 키워드 매치
  const tagHits = item.tags.filter((tag) =>
    intent.keywords.some((kw) => tag.includes(kw) || kw.includes(tag)),
  );
  if (tagHits.length > 0) {
    score += W.keyword * 2;
    reasons.push('관련 굿즈');
  }

  return { score: Math.round(score), reasons };
}

/**
 * ParsedIntent에 기반해 전체 상품을 스코어링하고 점수순 정렬 반환.
 */
export function scoreProducts(intent: ParsedIntent): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  // 광고 스코어링
  if (intent.productTypes.includes('ad')) {
    for (const ad of adProducts) {
      const { score, reasons } = scoreAdProduct(ad, intent);
      if (score > 0) {
        results.push({
          id: ad.id,
          category: 'ad',
          score,
          matchReasons: reasons,
          product: ad,
        });
      }
    }
  }

  // 대관 스코어링
  if (intent.productTypes.includes('venue')) {
    for (const venue of venues) {
      const { score, reasons } = scoreVenue(venue, intent);
      if (score > 0) {
        results.push({
          id: venue.id,
          category: 'venue',
          score,
          matchReasons: reasons,
          product: venue,
        });
      }
    }
  }

  // 굿즈 스코어링 (페널티 제거 — 공정 점수)
  if (intent.productTypes.includes('goods')) {
    for (const item of goodsItems) {
      const { score, reasons } = scoreGoods(item, intent);
      if (score > 0) {
        results.push({
          id: item.id,
          category: 'goods',
          score,
          matchReasons: reasons,
          product: item,
        });
      }
    }
  } else {
    // 굿즈 미지정 시에도 보조 추천
    for (const item of goodsItems) {
      const { score, reasons } = scoreGoods(item, intent);
      if (score > 15) {
        results.push({
          id: item.id,
          category: 'goods',
          score,
          matchReasons: reasons,
          product: item,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * 카테고리 다양성을 보장하는 추천 결과 반환.
 * 각 카테고리에서 상위 2~3개씩 선택하여 동질적 결과 방지.
 */
export function scoreDiverseProducts(intent: ParsedIntent): RecommendationResult[] {
  const all = scoreProducts(intent);

  const byCategory: Record<string, RecommendationResult[]> = {};
  for (const r of all) {
    const cat = r.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(r);
  }

  const diverse: RecommendationResult[] = [];
  const categoryOrder: ProductCategory[] = ['ad', 'venue', 'goods', 'popup'];

  for (const cat of categoryOrder) {
    const items = byCategory[cat] ?? [];
    const take = Math.min(items.length, cat === 'popup' ? 1 : 2);
    diverse.push(...items.slice(0, take));
  }

  return diverse.sort((a, b) => b.score - a.score);
}
