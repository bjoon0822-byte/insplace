// Google Analytics 4 이벤트 헬퍼
// GA4 측정 ID는 환경변수 NEXT_PUBLIC_GA_ID로 설정

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

/** GA4 페이지뷰 추적 */
export function pageview(url: string) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_ID, { page_path: url });
}

/** GA4 커스텀 이벤트 추적 */
export function event(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
}

// 미리 정의된 이벤트 헬퍼
export const analytics = {
  /** 상품 조회 */
  viewProduct: (type: string, id: string, name: string) =>
    event('view_item', { item_category: type, item_id: id, item_name: name }),

  /** 견적에 추가 */
  addToQuote: (type: string, id: string, name: string, price: number) =>
    event('add_to_cart', { item_category: type, item_id: id, item_name: name, value: price }),

  /** 문의 전송 */
  submitInquiry: (subject: string) =>
    event('generate_lead', { lead_type: subject }),

  /** 회원가입 */
  signUp: (method: string) =>
    event('sign_up', { method }),

  /** 로그인 */
  login: (method: string) =>
    event('login', { method }),

  /** 검색 */
  search: (query: string) =>
    event('search', { search_term: query }),

  /** 게시글 작성 */
  createPost: (category: string) =>
    event('create_content', { content_type: 'post', content_category: category }),

  /** 리뷰 작성 */
  createReview: (targetType: string, targetId: string, rating: number) =>
    event('create_content', { content_type: 'review', target_type: targetType, target_id: targetId, rating }),
};
