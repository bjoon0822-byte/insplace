// locale 유효성 검증 미들웨어
import { NextRequest, NextResponse } from 'next/server';

const locales = ['ko', 'en', 'ja', 'zh'];
const defaultLocale = 'ko';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일, API, _next 등은 건너뜀
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/mockups') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 루트는 /ko로 리다이렉트 (page.tsx에서도 처리하지만 안전장치)
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 첫 번째 경로 세그먼트가 유효한 locale인지 확인
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (!locales.includes(firstSegment)) {
    // 유효하지 않은 locale → 기본 locale로 리다이렉트
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
