export interface GalleryItem {
  id: string;
  title: string;
  artistName: string;
  category: 'digital' | 'lightbox' | 'cafe' | 'popup';
  location: string;
  date: string;
  imageUrl: string;
  adProductId: string | null;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-001',
    title: '지민 생일 강남역 전광판',
    artistName: '지민 (BTS)',
    category: 'digital',
    location: '강남역 2번 출구',
    date: '2025-10-13',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: 'ad-001',
  },
  {
    id: 'gallery-002',
    title: '원영 데뷔 기념 삼성역 라이트박스',
    artistName: '원영 (IVE)',
    category: 'lightbox',
    location: '삼성역 5번 출구',
    date: '2025-12-01',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: 'ad-003',
  },
  {
    id: 'gallery-003',
    title: '해린 생일 카페 이벤트',
    artistName: '해린 (NewJeans)',
    category: 'cafe',
    location: '홍대 스타벅스 근처',
    date: '2025-05-15',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: null,
  },
  {
    id: 'gallery-004',
    title: '정국 솔로 앨범 기념 홍대입구역',
    artistName: '정국 (BTS)',
    category: 'digital',
    location: '홍대입구역 7번 출구',
    date: '2025-09-01',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: 'ad-002',
  },
  {
    id: 'gallery-005',
    title: '카리나 생일 강남 팝업',
    artistName: '카리나 (aespa)',
    category: 'popup',
    location: '강남 COEX 인근',
    date: '2025-04-11',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: null,
  },
  {
    id: 'gallery-006',
    title: '민지 데뷔 기념 성수동 라이트박스',
    artistName: '민지 (NewJeans)',
    category: 'lightbox',
    location: '성수역 3번 출구',
    date: '2025-08-01',
    imageUrl: '/images/gallery/placeholder.webp',
    adProductId: 'ad-005',
  },
];
