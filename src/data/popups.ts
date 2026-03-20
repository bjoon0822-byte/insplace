import { PopupEvent } from '@/types';

export const popupEvents: PopupEvent[] = [
  {
    id: 'popup-001',
    nameKey: '더 리본스 팝업',
    location: '더현대 서울 지하 1층',
    startDate: '2026-03-20',
    endDate: '2026-04-05',
    status: 'upcoming',
    descriptionKey: '최애의 특별한 날을 기념하는 프리미엄 팝업 스토어가 더현대에서 열립니다.',
    imageUrl: '/images/nanobanana/popup.webp',
  },
  {
    id: 'popup-002',
    nameKey: '블루밍 모먼트 전시회',
    location: '성수역 인근 갤러리',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    status: 'ongoing',
    descriptionKey: '팬아터 연합 주최 대규모 사진전 및 굿즈 나눔 행사.',
    imageUrl: '/images/nanobanana/popup.webp',
  },
  {
    id: 'popup-003',
    nameKey: '시크릿 파티룸',
    location: '강남역 루프탑 카페',
    startDate: '2026-02-14',
    endDate: '2026-02-28',
    status: 'ended',
    descriptionKey: '프라이빗한 공간에서 진행된 데뷔 3주년 기념 시크릿 파티.',
    imageUrl: '/images/nanobanana/venue.webp',
  },
  {
    id: 'popup-004',
    nameKey: '썸머 일루전 팝업',
    location: '부산 해운대 광장',
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    status: 'upcoming',
    descriptionKey: '여름 밤바다를 수놓을 역대급 규모의 해변 팝업 이벤트.',
    imageUrl: '/images/nanobanana/hero.webp',
  }
];
