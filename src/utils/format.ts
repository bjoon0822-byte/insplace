// 공용 포맷팅 유틸리티

/** 한국 원화 포맷 (1,500,000) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}
