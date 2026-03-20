import { GoodsItem } from '@/types';

export const goodsItems: GoodsItem[] = [
  {
    id: 'goods-001',
    category: 'photocard',
    nameKey: '홀로그램 포토카드',
    price: 500,
    descriptionKey: '빛에 따라 변하는 고급스러운 홀로그램 코팅 포토카드. 최소 100장 단위 제작 가능.',
    minOrder: 100,
    imageUrl: '/images/nanobanana/goods.webp',
  },
  {
    id: 'goods-002',
    category: 'slogan',
    nameKey: '프리미엄 반사 슬로건',
    price: 15000,
    descriptionKey: '콘서트장 필수템! 플래시를 터뜨리면 환하게 빛나는 고품질 스웨이드 반사 슬로건.',
    minOrder: 10,
    imageUrl: '/images/nanobanana/goods.webp',
  },
  {
    id: 'goods-003',
    category: 'cake',
    nameKey: '맞춤형 레터링 케이크',
    price: 45000,
    descriptionKey: '원하는 디자인과 문구를 넣을 수 있는 프리미엄 생일 케이크 (1호 기준).',
    minOrder: 1,
    imageUrl: '/images/nanobanana/venue.webp',
  },
  {
    id: 'goods-004',
    category: 'cupholder',
    nameKey: '풀컬러 종이 컵홀더',
    price: 120,
    descriptionKey: '생일 이벤트 카페 필수품. 고해상도 인쇄가 적용된 프리미엄 종이 컵홀더.',
    minOrder: 500,
    imageUrl: '/images/nanobanana/goods.webp',
  },
  {
    id: 'goods-005',
    category: 'bouquet',
    nameKey: '블루밍 플라워 박스',
    price: 85000,
    descriptionKey: '최애의 탄생화나 시그니처 컬러에 맞춰 전문 플로리스트가 제작하는 커스텀 꽃다발.',
    minOrder: 1,
    imageUrl: '/images/nanobanana/venue.webp',
  }
];
