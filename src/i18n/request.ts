// 번역 메시지 로더
// 왜: JSON 번역 파일을 동적으로 로드

import { Locale } from '@/types';

// 번역 메시지 캐시
const messageCache: Record<string, Record<string, unknown>> = {};

/** 지정 locale의 번역 메시지를 불러옴 */
export async function getMessages(locale: Locale): Promise<Record<string, unknown>> {
  if (messageCache[locale]) {
    return messageCache[locale];
  }

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    messageCache[locale] = messages;
    return messages;
  } catch {
    // fallback: 한국어
    const messages = (await import('../../messages/ko.json')).default;
    messageCache['ko'] = messages;
    return messages;
  }
}

/**
 * 중첩된 키 경로로 번역 값을 가져옴
 * 예: t(messages, 'nav.home') => "홈"
 */
export function t(messages: Record<string, unknown>, key: string): string {
  const keys = key.split('.');
  let current: unknown = messages;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      // 키를 찾지 못하면 키 자체를 반환 (디버깅 용이)
      return key;
    }
  }

  return typeof current === 'string' ? current : key;
}
