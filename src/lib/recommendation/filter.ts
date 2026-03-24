import type { ExplorerState, AdProduct, Venue, GoodsItem } from '@/types';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';

/** 예산 등급별 범위 (KRW) */
const BUDGET_RANGES: Record<string, [number, number]> = {
  budget: [0, 500_000],
  standard: [500_000, 5_000_000],
  premium: [5_000_000, 15_000_000],
  luxury: [15_000_000, Infinity],
};

export interface FilteredProducts {
  ads: AdProduct[];
  venues: Venue[];
  goods: GoodsItem[];
}

/**
 * Explorer 위자드의 선택 상태로 상품을 필터링한다.
 */
export function filterByExplorerState(state: Partial<ExplorerState>): FilteredProducts {
  let filteredAds = [...adProducts];
  let filteredVenues = [...venues];
  let filteredGoods = [...goodsItems];

  // 1. 지역 필터
  if (state.region) {
    filteredAds = filteredAds.filter((a) => a.regionNormalized === state.region);
    filteredVenues = filteredVenues.filter((v) => v.regionNormalized === state.region);
    // 굿즈는 지역 무관
  }

  // 2. 예산 필터
  if (state.budgetRange) {
    const [min, max] = state.budgetRange;
    filteredAds = filteredAds.filter((a) => a.price >= min && a.price <= max);
    filteredVenues = filteredVenues.filter((v) => v.pricePerDay >= min && v.pricePerDay <= max);
  }

  // 3. 규모 필터
  if (state.scaleTier) {
    filteredAds = filteredAds.filter((a) => a.scaleTier === state.scaleTier);
    // 대관은 규모 기준이 다르지만 scaleTier 있으면 필터
    filteredVenues = filteredVenues.filter((v) => v.scaleTier === state.scaleTier);
  }

  // 4. 목적 필터
  if (state.purpose) {
    filteredAds = filteredAds.filter((a) => a.purposes.includes(state.purpose!));
    filteredVenues = filteredVenues.filter((v) => v.purposes.includes(state.purpose!));
    filteredGoods = filteredGoods.filter((g) => g.purposes.includes(state.purpose!));
  }

  return {
    ads: filteredAds,
    venues: filteredVenues,
    goods: filteredGoods,
  };
}

/**
 * 예산 등급 문자열 → [min, max] 범위로 변환
 */
export function budgetTierToRange(tier: string): [number, number] | null {
  return BUDGET_RANGES[tier] ?? null;
}

/**
 * 각 지역에 해당하는 상품 수 반환 (위자드 UI용)
 */
export function countByRegion(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ad of adProducts) {
    counts[ad.regionNormalized] = (counts[ad.regionNormalized] ?? 0) + 1;
  }
  for (const venue of venues) {
    counts[venue.regionNormalized] = (counts[venue.regionNormalized] ?? 0) + 1;
  }
  return counts;
}
