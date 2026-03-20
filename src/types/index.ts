// 옥외광고 플랫폼 공통 타입 정의

/** 지원 언어 코드 */
export type Locale = 'ko' | 'en' | 'ja' | 'zh';

/** 광고 상품 유형 */
export type AdType = 'digital' | 'lightbox';

/** 예약 가용 상태 */
export type AvailabilityStatus = 'available' | 'busy' | 'soldout';

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
  name: string;
  count: number;
  change: number;         // 순위 변동 (+, -, 0)
}

/** 네비게이션 메뉴 아이템 */
export interface NavItem {
  labelKey: string;       // i18n 키
  href: string;
  children?: NavItem[];
}
