// 옥외광고 플랫폼 공통 타입 정의

/** 지원 언어 코드 */
export type Locale = 'ko' | 'en' | 'ja' | 'zh';

/** 광고 상품 유형 */
export type AdType = 'digital' | 'lightbox';

/** 예약 가용 상태 */
export type AvailabilityStatus = 'available' | 'busy' | 'soldout';

/** 광고 목적 태그 */
export type AdPurpose =
  | 'birthday'       // 생일
  | 'debut'          // 데뷔 기념일
  | 'comeback'       // 컴백
  | 'drama'          // 드라마/영화 응원
  | 'concert'        // 콘서트/투어
  | 'anniversary'    // 활동 기념일
  | 'graduation'     // 졸업/입학
  | 'general';       // 일반 홍보

/** 예산 등급 */
export type BudgetTier = 'budget' | 'standard' | 'premium' | 'luxury';

/** 규모 등급 */
export type ScaleTier = 'small' | 'medium' | 'large' | 'mega';

/** 통합 상품 카테고리 */
export type ProductCategory = 'ad' | 'venue' | 'goods' | 'popup';

/** 광고 상품 */
export interface AdProduct {
  id: string;
  type: AdType;
  nameKey: string;        // i18n 키
  location: string;       // 위치 (예: "홍대입구역 2번 출구")
  region: string;         // 지역 (예: "서울")
  price: number;          // 원(KRW)
  pricePeriod: string;    // "7일" | "14일" | "1개월"
  size: string;           // "1960x580mm"
  availability: AvailabilityStatus;
  views: number;          // 일 평균 유동인구
  descriptionKey: string; // i18n 키
  specs: Record<string, string>; // 상세 스펙
  imageUrl: string;       // 갤러리 퀄리티 고해상도 이미지
  tags: string[];              // 검색/매칭용 태그
  purposes: AdPurpose[];       // 적합한 광고 목적
  budgetTier: BudgetTier;
  scaleTier: ScaleTier;
  regionNormalized: string;    // '서울-마포' 형식
}

/** 대관 장소 */
export interface Venue {
  id: string;
  nameKey: string;
  location: string;
  region: string;
  capacity: number;       // 수용 인원
  pricePerDay: number;    // 일 대관료
  amenities: string[];    // 제공 시설 (프로젝터, WiFi 등)
  descriptionKey: string;
  availability: AvailabilityStatus;
  imageUrl: string;
  tags: string[];
  purposes: AdPurpose[];
  budgetTier: BudgetTier;
  scaleTier: ScaleTier;
  regionNormalized: string;
}

/** 굿즈 상품 */
export interface GoodsItem {
  id: string;
  category: 'photocard' | 'slogan' | 'cake' | 'bouquet' | 'cupholder';
  nameKey: string;
  price: number;
  descriptionKey: string;
  minOrder: number;       // 최소 주문 수량
  imageUrl: string;
  specs?: Record<string, string>; // 상세 스펙 (크기, 재질 등)
  tags: string[];
  purposes: AdPurpose[];
  bundlesWith: string[];       // 추천 조합 상품 ID
}

/** 팝업스토어 */
export interface PopupEvent {
  id: string;
  nameKey: string;
  location: string;
  startDate: string;      // ISO 날짜
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  descriptionKey: string;
  imageUrl: string;
}

/** 트렌드 항목 */
export interface TrendItem {
  rank: number;
  id: string;             // i18n 키
  name: string;           // 기본 한국어 이름 (폴백용)
  count: number;
  change: number;         // 순위 변동 (+, -, 0)
  history?: number[];     // 최근 7일 추이 (스파크라인용)
  percentage?: number;    // 전체 대비 비율 (프로그레스 바용)
}

/** 견적 장바구니 아이템 */
export interface QuoteItem {
  id: string;
  type: 'ad' | 'venue' | 'goods';
  name: string;
  price: number;
  pricePeriod?: string;
  imageUrl?: string;
}

/** 네비게이션 메뉴 아이템 */
export interface NavItem {
  labelKey: string;       // i18n 키
  href: string;
  children?: NavItem[];
}

/* ── 커뮤니티 ── */

/** 유저 레벨 */
export type UserLevel = 'newbie' | 'fan' | 'superfan' | 'master' | 'legend';

/** 레벨 기준 포인트 */
export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  newbie: 0,
  fan: 50,
  superfan: 200,
  master: 500,
  legend: 1000,
};

/** 유저 역할 */
export type UserRole = 'user' | 'admin';

/** 유저 프로필 */
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  points: number;
  level: UserLevel;
  role: UserRole;
  post_count: number;
  comment_count: number;
  review_count: number;
  created_at: string;
}

/** 커뮤니티 게시글 */
export interface Post {
  id: string;
  author_id: string;
  author: UserProfile;
  title: string;
  content: string;
  category: 'free' | 'review' | 'info' | 'question';
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/** 댓글 */
export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author: UserProfile;
  content: string;
  created_at: string;
}

/** 리뷰 (광고/대관/굿즈/팝업 별점) */
export interface Review {
  id: string;
  author_id: string;
  author: UserProfile;
  target_type: 'ad' | 'venue' | 'goods' | 'popup';
  target_id: string;
  rating: number;          // 1~5
  content: string;
  created_at: string;
}

/* ── 추천 시스템 ── */

/** 추천 결과 */
export interface RecommendationResult {
  id: string;
  category: ProductCategory;
  score: number;               // 0-100 관련도 점수
  matchReasons: string[];      // ['지역 일치', '예산 범위 내']
  product: AdProduct | Venue | GoodsItem | PopupEvent;
}

/** 파싱된 사용자 의도 */
export interface ParsedIntent {
  purposes: AdPurpose[];
  regions: string[];
  budgetMax: number | null;
  duration: number | null;     // 일 단위
  productTypes: ProductCategory[];
  keywords: string[];
  artistName: string | null;
}

/** 과거 집행 사례 */
export interface CaseStudy {
  id: string;
  productId: string;
  productType: ProductCategory;
  title: string;
  artistName: string;
  purpose: AdPurpose;
  date: string;
  imageUrls: string[];
  description: string;
}

/** 디자인 시안 참고 */
export interface DesignReference {
  id: string;
  productId: string;
  category: 'birthday' | 'debut' | 'concert' | 'general';
  title: string;
  imageUrl: string;
  dimensions: string;
}

/** 팬 여정 단계 (챗봇 추천 결과) */
export interface JourneyStep {
  order: number;
  role: 'attention' | 'gathering' | 'memento';
  label: string;
  product: RecommendationResult;
  note: string;
}

/** 팬 여정 패키지 (챗봇 추천 결과) */
export interface JourneyPackage {
  name: string;
  region: string;
  regionInfo: string;
  purpose: string;
  steps: JourneyStep[];
  totalEstimate: number;
  description: string;
}

/** 지역 통계 정보 (챗봇 카드용) */
export interface RegionInfo {
  id: string;
  name: string;
  dailyVisitors: number;
  subwayDailyUsers: number;
  subwayRank: number;
  externalVisitorRatio: number;
  stationHighlight: string;
  recommendation: string;
}

/** 챗봇 메시지 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: RecommendationResult[];
  journey?: JourneyPackage;
  regionInfo?: RegionInfo;
  timestamp: number;
}

/** 탐색기 위자드 상태 */
export interface ExplorerState {
  step: 1 | 2 | 3 | 4;
  region: string | null;
  budgetRange: [number, number] | null;
  scaleTier: ScaleTier | null;
  purpose: AdPurpose | null;
}
