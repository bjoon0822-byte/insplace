// 공용 포맷팅 유틸리티

/** 한국 원화 포맷 (1,500,000) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/** 한국식 큰 숫자 포맷 (190000 → "19만") */
export function formatLargeNumber(n: number): string {
  if (n >= 10000) {
    const man = Math.round(n / 10000);
    return `${man}만`;
  }
  return formatPrice(n);
}

/** 한국식 큰 숫자 + 명 (190000 → "19만명") */
export function formatTraffic(n: number): string {
  return `${formatLargeNumber(n)}명`;
}
