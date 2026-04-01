// Shared formatting utilities

/** Format KRW price with commas (1,500,000) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

/** Locale-aware large number format (190000 → "19만" / "190K") */
export function formatLargeNumber(n: number, locale: string = 'ko'): string {
  if (locale === 'en') {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return new Intl.NumberFormat('en-US').format(n);
  }
  // ko, ja, zh use 만/万 (10K unit)
  if (n >= 10000) {
    const man = Math.round(n / 10000);
    const suffix = locale === 'ko' ? '만' : '万';
    return `${man}${suffix}`;
  }
  return formatPrice(n);
}
