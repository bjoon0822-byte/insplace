// i18n 라우팅 설정
// 왜: next-intl 없이 직접 locale 라우팅을 구현 (의존성 최소화)

import { Locale } from '@/types';

export const locales: Locale[] = ['ko', 'en', 'ja', 'zh'];
export const defaultLocale: Locale = 'ko';

/** URL 경로에서 locale 추출 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] as Locale;
  if (locales.includes(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}
