import { NextRequest, NextResponse } from 'next/server';
import { parseIntent } from '@/lib/recommendation/intent-parser';
import { scoreProducts } from '@/lib/recommendation/scoring';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
      return NextResponse.json(
        { error: '검색어를 2자 이상 입력해주세요.' },
        { status: 400 },
      );
    }

    const intent = parseIntent(prompt);
    const results = scoreProducts(intent);

    return NextResponse.json({
      intent,
      results: results.slice(0, 8),
      total: results.length,
    });
  } catch {
    return NextResponse.json(
      { error: '추천 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
