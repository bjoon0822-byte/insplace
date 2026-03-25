// 팬 여정 패키지 빌더
// 왜: 챗봇 Step 3에서 광고→대관→굿즈 3단계 동선을 구성

import type { AdPurpose, ScaleTier, RecommendationResult, JourneyStep, JourneyPackage, GoodsItem } from '@/types';
import { findJourneyTemplates } from '@/data/journey-templates';
import { scoreProducts } from '@/lib/recommendation/scoring';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';
import { getRegionContext } from '@/data/region-context';

/** 예산으로 budgetTier 결정 */
function getBudgetTier(budgetMax?: number): string | undefined {
  if (!budgetMax) return undefined;
  if (budgetMax <= 500000) return 'budget';
  if (budgetMax <= 3000000) return 'standard';
  if (budgetMax <= 10000000) return 'premium';
  return 'luxury';
}

/** 상품 ID로 RecommendationResult 생성 */
function productToResult(
  productId: string,
  reasons: string[],
): RecommendationResult | null {
  const ad = adProducts.find((a) => a.id === productId);
  if (ad) {
    return {
      id: ad.id,
      category: 'ad',
      score: 80,
      matchReasons: reasons,
      product: ad,
    };
  }

  const venue = venues.find((v) => v.id === productId);
  if (venue) {
    return {
      id: venue.id,
      category: 'venue',
      score: 80,
      matchReasons: reasons,
      product: venue,
    };
  }

  const goods = goodsItems.find((g) => g.id === productId);
  if (goods) {
    return {
      id: goods.id,
      category: 'goods',
      score: 80,
      matchReasons: reasons,
      product: goods,
    };
  }

  return null;
}

/** 상품 가격 추출 */
function getPrice(result: RecommendationResult): number {
  if (result.category === 'ad') {
    return (result.product as { price: number }).price;
  }
  if (result.category === 'venue') {
    return (result.product as { pricePerDay: number }).pricePerDay;
  }
  if (result.category === 'goods') {
    const g = result.product as GoodsItem;
    return g.price * g.minOrder;
  }
  return 0;
}

/** 예산 초과 시 description에 안내 추가 */
function applyBudgetCheck(pkg: JourneyPackage, budgetMax?: number): JourneyPackage {
  if (!budgetMax || pkg.totalEstimate <= budgetMax) return pkg;

  const overAmount = pkg.totalEstimate - budgetMax;
  return {
    ...pkg,
    description: `${pkg.description} (예산 대비 약 ${overAmount.toLocaleString()}원 초과 — 개별 항목 조정 가능)`,
  };
}

/** 동적 여정 생성 (템플릿이 없을 때) */
function buildDynamicJourney(params: {
  region: string;
  purpose: AdPurpose;
  budgetMax?: number;
  scale?: ScaleTier;
}): JourneyPackage {
  const regionCtx = getRegionContext(params.region);

  // 각 카테고리별 최적 상품 찾기
  const adResults = scoreProducts({
    regions: [params.region],
    budgetMax: params.budgetMax ?? null,
    purposes: [params.purpose],
    duration: null,
    productTypes: ['ad'],
    keywords: [],
    artistName: null,
  });

  const venueResults = scoreProducts({
    regions: [params.region],
    budgetMax: params.budgetMax ?? null,
    purposes: [params.purpose],
    duration: null,
    productTypes: ['venue'],
    keywords: [],
    artistName: null,
  });

  const goodsResults = scoreProducts({
    regions: [],
    budgetMax: null,
    purposes: [params.purpose],
    duration: null,
    productTypes: ['goods'],
    keywords: [],
    artistName: null,
  });

  const bestAd = adResults[0];
  const bestVenue = venueResults[0];
  const bestGoods = goodsResults[0];

  const steps: JourneyStep[] = [];

  if (bestAd) {
    steps.push({
      order: 1,
      role: 'attention',
      label: '관심 끌기',
      product: bestAd,
      note: regionCtx
        ? `${regionCtx.name} 유동인구 ${regionCtx.dailyFootTraffic.toLocaleString()}명에게 노출`
        : '유동인구가 높은 위치에서 광고 노출',
    });
  }

  if (bestVenue) {
    steps.push({
      order: 2,
      role: 'gathering',
      label: '팬 모임',
      product: bestVenue,
      note: '팬 모임 및 이벤트를 위한 장소',
    });
  }

  if (bestGoods) {
    steps.push({
      order: 3,
      role: 'memento',
      label: '기념품',
      product: bestGoods,
      note: '방문 팬을 위한 기념 굿즈',
    });
  }

  const total = steps.reduce((sum, s) => sum + getPrice(s.product), 0);

  return {
    name: `${regionCtx?.name ?? params.region} 맞춤 패키지`,
    region: params.region,
    regionInfo: regionCtx?.recommendation ?? '',
    purpose: params.purpose,
    steps,
    totalEstimate: total,
    description: `${regionCtx?.name ?? params.region}에서 ${params.purpose} 이벤트를 위한 맞춤 여정 패키지`,
  };
}

/**
 * 팬 여정 패키지 빌드.
 * 1. 매칭 템플릿 우선 사용
 * 2. 없으면 동적 생성
 */
export function buildJourneyPackage(params: {
  region: string;
  purpose: AdPurpose;
  budgetMax?: number;
  scale?: ScaleTier;
}): JourneyPackage {
  const budgetTier = getBudgetTier(params.budgetMax);
  const regionCtx = getRegionContext(params.region);

  // 템플릿 검색
  const templates = findJourneyTemplates({
    region: params.region,
    purpose: params.purpose,
    budgetTier: budgetTier as 'budget' | 'standard' | 'premium' | 'luxury' | undefined,
  });

  if (templates.length === 0) {
    // 목적+지역만으로 재검색
    const broader = findJourneyTemplates({
      region: params.region,
      purpose: params.purpose,
    });

    if (broader.length === 0) {
      return applyBudgetCheck(buildDynamicJourney(params), params.budgetMax);
    }

    // 예산에 가장 가까운 템플릿 선택
    const template = params.budgetMax
      ? broader.reduce((best, t) => {
          const bestDiff = Math.abs((best.totalEstimate[0] + best.totalEstimate[1]) / 2 - params.budgetMax!);
          const tDiff = Math.abs((t.totalEstimate[0] + t.totalEstimate[1]) / 2 - params.budgetMax!);
          return tDiff < bestDiff ? t : best;
        })
      : broader[0];

    const pkg = templateToResult(template, regionCtx?.recommendation ?? '');
    return applyBudgetCheck(pkg, params.budgetMax);
  }

  const pkg = templateToResult(templates[0], regionCtx?.recommendation ?? '');
  return applyBudgetCheck(pkg, params.budgetMax);
}

/** 템플릿을 JourneyPackage로 변환 */
function templateToResult(
  template: ReturnType<typeof findJourneyTemplates>[number],
  regionInfo: string,
): JourneyPackage {
  const steps: JourneyStep[] = [];

  for (const step of template.steps) {
    // productIds를 순서대로 시도하여 첫 번째 유효한 상품 사용
    let result: RecommendationResult | null = null;
    for (const pid of step.productIds) {
      result = productToResult(pid, [step.note]);
      if (result) break;
    }

    // 모든 상품 조회 실패 시 해당 스텝 건너뜀
    if (!result) continue;

    steps.push({
      order: step.order,
      role: step.role,
      label: step.label,
      product: result,
      note: step.note,
    });
  }

  const total = steps.reduce((sum, s) => sum + getPrice(s.product), 0);

  return {
    name: template.name,
    region: template.region,
    regionInfo,
    purpose: template.purpose,
    steps,
    totalEstimate: total,
    description: template.description,
  };
}
