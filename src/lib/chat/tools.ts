import type { ChatCompletionTool } from 'openai/resources/chat/completions';
import type {
  ParsedIntent,
  RecommendationResult,
  AdPurpose,
  ProductCategory,
  AdProduct,
  Venue,
  GoodsItem,
  JourneyPackage,
} from '@/types';
import { scoreDiverseProducts } from '@/lib/recommendation/scoring';
import { buildJourneyPackage } from '@/lib/recommendation/journey-builder';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';
import { caseStudies } from '@/data/case-studies';
import { designReferences } from '@/data/design-references';
import { getRegionContext } from '@/data/region-context';
import type { RegionInfo } from '@/types';

/** OpenAI function calling 정의 */
export const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_region_info',
      description:
        '특정 지역의 유동인구 통계와 특성 정보를 조회합니다. 지역이 확정되었을 때 호출하세요.',
      parameters: {
        type: 'object',
        properties: {
          region: {
            type: 'string',
            description:
              '지역 코드. 예: 서울-마포, 서울-강남, 서울-성동, 서울-송파, 서울-종로',
          },
        },
        required: ['region'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_products',
      description:
        '사용자의 조건에 맞는 광고 상품, 대관 장소, 굿즈를 검색하고 관련도 점수 기반으로 추천합니다. 카테고리 다양성을 보장하여 광고, 대관, 굿즈가 골고루 포함됩니다.',
      parameters: {
        type: 'object',
        properties: {
          region: {
            type: 'string',
            description:
              '지역 코드. 예: 서울-마포, 서울-강남, 서울-성동, 서울-종로, 대구, 부산',
          },
          budget_max: {
            type: 'number',
            description: '최대 예산 (원 단위). 예: 500000, 1000000',
          },
          purpose: {
            type: 'string',
            enum: [
              'birthday',
              'debut',
              'comeback',
              'drama',
              'concert',
              'anniversary',
              'graduation',
              'general',
            ],
            description: '광고 목적',
          },
          product_types: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['ad', 'venue', 'goods', 'popup'],
            },
            description:
              '검색할 상품 유형. 기본값: ["ad", "venue", "goods"]',
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: '추가 키워드. 예: ["디지털", "사이니지", "LED"]',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_journey_package',
      description:
        '목적, 지역, 예산에 맞는 팬 여정 패키지(광고→대관→굿즈 3단계 동선)를 검색합니다. 반드시 목적, 지역, 예산이 모두 확인된 후에만 호출하세요.',
      parameters: {
        type: 'object',
        properties: {
          region: {
            type: 'string',
            description: '지역 코드. 예: 서울-마포, 서울-강남, 서울-성동',
          },
          budget_max: {
            type: 'number',
            description: '최대 예산 (원 단위)',
          },
          purpose: {
            type: 'string',
            enum: [
              'birthday',
              'debut',
              'comeback',
              'drama',
              'concert',
              'anniversary',
              'graduation',
              'general',
            ],
            description: '이벤트 목적',
          },
          scale: {
            type: 'string',
            enum: ['small', 'medium', 'large'],
            description: '이벤트 규모',
          },
        },
        required: ['region', 'purpose'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_detail',
      description: '특정 상품의 상세 정보를 조회합니다.',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            description: '상품 ID. 예: ad-001, venue-003, goods-002',
          },
          product_type: {
            type: 'string',
            enum: ['ad', 'venue', 'goods'],
            description: '상품 유형',
          },
        },
        required: ['product_id', 'product_type'],
      },
    },
  },
];

/** search_products tool 실행 (다양성 보장) */
export function executeSearchProducts(input: {
  region?: string;
  budget_max?: number;
  purpose?: string;
  product_types?: string[];
  keywords?: string[];
}): { results: RecommendationResult[]; total: number } {
  const intent: ParsedIntent = {
    regions: input.region ? [input.region] : [],
    budgetMax: input.budget_max ?? null,
    purposes: input.purpose
      ? [input.purpose as AdPurpose]
      : ['general'],
    duration: null,
    productTypes:
      (input.product_types as ProductCategory[]) ?? ['ad', 'venue', 'goods'],
    keywords: input.keywords ?? [],
    artistName: null,
  };

  const diverse = scoreDiverseProducts(intent);

  const results = diverse.map((r) => ({
    id: r.id,
    category: r.category,
    score: r.score,
    matchReasons: r.matchReasons,
    budgetFit: describeBudgetFit(r.product, r.category, input.budget_max),
    product: serializeProduct(r.product, r.category),
  }));

  return { results: results as unknown as RecommendationResult[], total: diverse.length };
}

/** search_journey_package tool 실행 */
export function executeSearchJourneyPackage(input: {
  region: string;
  purpose: string;
  budget_max?: number;
  scale?: string;
}): { journey: JourneyPackage } {
  const journey = buildJourneyPackage({
    region: input.region,
    purpose: input.purpose as AdPurpose,
    budgetMax: input.budget_max,
    scale: input.scale as 'small' | 'medium' | 'large' | undefined,
  });

  // 상품을 직렬화하여 GPT가 읽을 수 있게 변환
  const serialized: JourneyPackage = {
    ...journey,
    steps: journey.steps.map((step) => ({
      ...step,
      product: {
        ...step.product,
        product: serializeProduct(step.product.product, step.product.category),
      } as unknown as RecommendationResult,
    })),
  };

  return { journey: serialized };
}

/** get_product_detail tool 실행 */
export function executeGetProductDetail(input: {
  product_id: string;
  product_type: string;
}): Record<string, unknown> | null {
  const { product_id, product_type } = input;

  if (product_type === 'ad') {
    const ad = adProducts.find((a) => a.id === product_id);
    if (!ad) return null;
    const cases = caseStudies.filter(
      (c) => c.productId === product_id && c.productType === 'ad',
    );
    const designs = designReferences.filter(
      (d) => d.productId === product_id,
    );
    return {
      ...ad,
      caseStudyCount: cases.length,
      designReferenceCount: designs.length,
    };
  }

  if (product_type === 'venue') {
    const venue = venues.find((v) => v.id === product_id);
    if (!venue) return null;
    const cases = caseStudies.filter(
      (c) => c.productId === product_id && c.productType === 'venue',
    );
    return { ...venue, caseStudyCount: cases.length };
  }

  if (product_type === 'goods') {
    const item = goodsItems.find((g) => g.id === product_id);
    if (!item) return null;
    return { ...item };
  }

  return null;
}

/** 예산 대비 가격 적합성 설명 생성 */
function describeBudgetFit(
  product: AdProduct | Venue | GoodsItem | unknown,
  category: ProductCategory,
  budgetMax?: number,
): string | null {
  if (!budgetMax) return null;

  let price = 0;
  let period = '';

  if (category === 'ad') {
    const p = product as AdProduct;
    price = p.price;
    period = p.pricePeriod;
  } else if (category === 'venue') {
    const p = product as Venue;
    price = p.pricePerDay;
    period = '1일';
  } else if (category === 'goods') {
    const p = product as GoodsItem;
    price = p.price;
    period = '1개';
  }

  const ratio = price / budgetMax;
  const remaining = budgetMax - price;

  if (ratio <= 0.5) {
    return `예산의 ${Math.round(ratio * 100)}%만 사용 (${remaining.toLocaleString()}원 여유). ${period} 기준 ${price.toLocaleString()}원`;
  } else if (ratio <= 0.8) {
    return `예산 대비 적절한 가격 (${period} 기준 ${price.toLocaleString()}원)`;
  } else if (ratio <= 1.0) {
    return `예산에 거의 맞는 가격 (${period} 기준 ${price.toLocaleString()}원, ${remaining.toLocaleString()}원 여유)`;
  } else {
    return `예산 초과 (${period} 기준 ${price.toLocaleString()}원, ${(price - budgetMax).toLocaleString()}원 초과)`;
  }
}

/** 상품을 직렬화 가능한 핵심 정보로 변환 */
function serializeProduct(
  product: AdProduct | Venue | GoodsItem | unknown,
  category: ProductCategory,
): Record<string, unknown> {
  if (category === 'ad') {
    const p = product as AdProduct;
    return {
      id: p.id,
      type: p.type,
      nameKey: p.nameKey,
      location: p.location,
      region: p.region,
      price: p.price,
      pricePeriod: p.pricePeriod,
      availability: p.availability,
      imageUrl: p.imageUrl,
    };
  }
  if (category === 'venue') {
    const p = product as Venue;
    return {
      id: p.id,
      nameKey: p.nameKey,
      location: p.location,
      region: p.region,
      pricePerDay: p.pricePerDay,
      capacity: p.capacity,
      availability: p.availability,
      imageUrl: p.imageUrl,
    };
  }
  if (category === 'goods') {
    const p = product as GoodsItem;
    return {
      id: p.id,
      category: p.category,
      nameKey: p.nameKey,
      price: p.price,
      minOrder: p.minOrder,
      imageUrl: p.imageUrl,
    };
  }
  return product as Record<string, unknown>;
}

/** get_region_info tool 실행 */
export function executeGetRegionInfo(input: {
  region: string;
}): { regionInfo: RegionInfo } | { error: string } {
  const ctx = getRegionContext(input.region);
  if (!ctx) {
    return { error: `지역 "${input.region}"을 찾을 수 없습니다.` };
  }

  const regionInfo: RegionInfo = {
    id: ctx.id,
    name: ctx.name,
    dailyVisitors: ctx.statistics.dailyVisitors,
    subwayDailyUsers: ctx.statistics.subwayDailyUsers,
    subwayRank: ctx.statistics.subwayRank,
    externalVisitorRatio: ctx.statistics.externalVisitorRatio,
    stationHighlight: ctx.statistics.stationHighlight,
    recommendation: ctx.recommendation,
  };

  return { regionInfo };
}
