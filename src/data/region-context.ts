// OOH 지역 컨텍스트 — 유동인구/특성 데이터
// 왜: 챗봇이 Step 1에서 지역 특성을 설명할 때 사용 + 탐색 페이지 통계 카드

export interface RegionStatistics {
  dailyVisitors: number;
  subwayDailyUsers: number;
  subwayRank: number;
  externalVisitorRatio: number;
  stationHighlight: string;
  imageUrl: string;
  englishName: string;
}

export interface RegionContext {
  id: string;
  name: string;
  dailyFootTraffic: number;
  peakHours: string;
  targetDemo: string;
  nearbyStations: string[];
  hotspots: string[];
  recommendation: string;
  statistics: RegionStatistics;
}

export const regionContexts: RegionContext[] = [
  {
    id: '서울-마포',
    name: '홍대/마포',
    dailyFootTraffic: 190000,
    peakHours: '14:00~22:00',
    targetDemo: '10~20대 K-POP 팬 비율이 가장 높은 지역. 외국인 관광객도 다수 방문',
    nearbyStations: ['홍대입구역', '합정역', '상수역'],
    hotspots: ['홍대 걷고싶은거리', '어울마당로', '양화로', '와우산로'],
    recommendation: 'K-POP 생일카페와 옥외광고의 성지. 유동인구가 서울 지하철역 중 상위 5위 안에 들며, 10~20대 팬층에게 가장 높은 도달률을 보여요.',
    statistics: {
      dailyVisitors: 190000,
      subwayDailyUsers: 110000,
      subwayRank: 1,
      externalVisitorRatio: 78,
      stationHighlight: '세 가지 환승역이 있는 MZ 문화의 중심지',
      englishName: 'Hongdae Station',
      imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800&q=80',
    },
  },
  {
    id: '서울-강남',
    name: '강남',
    dailyFootTraffic: 220000,
    peakHours: '08:00~21:00',
    targetDemo: '20~30대 직장인 중심. 프리미엄 광고 효과가 높은 지역',
    nearbyStations: ['강남역', '역삼역', '선릉역'],
    hotspots: ['강남대로', '테헤란로', '신분당선 환승통로'],
    recommendation: '프리미엄 이미지의 대형 LED 광고에 최적화된 지역이에요. 환승통로 200m 구간은 국내 최대 규모 미디어 설치 구간으로 임팩트가 매우 강해요.',
    statistics: {
      dailyVisitors: 220000,
      subwayDailyUsers: 100000,
      subwayRank: 2,
      externalVisitorRatio: 79,
      stationHighlight: '국내 최대 환승통로 미디어 구간 보유',
      englishName: 'Gangnam Station',
      imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    },
  },
  {
    id: '서울-성동',
    name: '성수',
    dailyFootTraffic: 75000,
    peakHours: '11:00~21:00',
    targetDemo: '20~30대 트렌드세터. 팝업/전시 친화적 지역',
    nearbyStations: ['성수역', '뚝섬역'],
    hotspots: ['연무장길', '서울숲길', '성수이로'],
    recommendation: '트렌디한 팝업과 전시 문화가 발달한 지역이에요. 갤러리형 공간이 많아 팬아트 전시나 데뷔 기념 갤러리에 특히 적합해요.',
    statistics: {
      dailyVisitors: 75000,
      subwayDailyUsers: 45000,
      subwayRank: 8,
      externalVisitorRatio: 72,
      stationHighlight: '트렌드를 이끄는 MZ 크리에이터 콘텐츠 허브',
      englishName: 'Seongsu',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    },
  },
  {
    id: '서울-송파',
    name: '잠실',
    dailyFootTraffic: 150000,
    peakHours: '10:00~22:00',
    targetDemo: '전 연령대. 콘서트/공연장 인근 집객 효과 우수',
    nearbyStations: ['잠실역', '종합운동장역', '석촌역'],
    hotspots: ['롯데월드몰', '올림픽대로', '송파대로'],
    recommendation: 'KSPO돔, 올림픽홀, 잠실실내체육관 등 공연장이 밀집해 있어 콘서트 전후 응원 광고와 뒤풀이 파티에 최적인 지역이에요.',
    statistics: {
      dailyVisitors: 150000,
      subwayDailyUsers: 75000,
      subwayRank: 6,
      externalVisitorRatio: 60,
      stationHighlight: '공연장 밀집 지역, 콘서트 전후 집객 최적',
      englishName: 'Jamsil',
      imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?w=800&q=80',
    },
  },
  {
    id: '서울-종로',
    name: '혜화/종로',
    dailyFootTraffic: 70000,
    peakHours: '12:00~20:00',
    targetDemo: '20~40대 문화 애호가. 대학로 공연 관객 유입',
    nearbyStations: ['혜화역', '종로3가역', '광화문역'],
    hotspots: ['대학로', '마로니에공원', '이화동벽화마을'],
    recommendation: '대학로 문화 지역으로 뮤지컬/연극 배우 팬덤에 특히 인기 있어요. 24시간 상시 노출되는 조명 광고가 특징이에요.',
    statistics: {
      dailyVisitors: 70000,
      subwayDailyUsers: 38000,
      subwayRank: 10,
      externalVisitorRatio: 55,
      stationHighlight: '24시간 상시 노출 대학로 문화 거리',
      englishName: 'Hyehwa',
      imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
    },
  },
  {
    id: '서울-중구',
    name: '명동/중구',
    dailyFootTraffic: 200000,
    peakHours: '10:00~21:00',
    targetDemo: '외국인 관광객 비율 국내 최고. 뷰티/쇼핑 중심 상권',
    nearbyStations: ['명동역', '을지로입구역', '충무로역'],
    hotspots: ['명동거리', '남산타워', '을지로', '충무로'],
    recommendation: '외국인 관광객 비율 1위의 국제적 쇼핑 거리예요. 글로벌 K-POP 팬 타겟 광고에 최적이며, 다국어 디지털 사이니지가 특히 효과적이에요.',
    statistics: {
      dailyVisitors: 200000,
      subwayDailyUsers: 95000,
      subwayRank: 3,
      externalVisitorRatio: 85,
      stationHighlight: '외국인 관광객 비율 1위, 글로벌 팬 타겟 최적',
      englishName: 'Myeongdong',
      imageUrl: 'https://images.unsplash.com/photo-1583167617666-6ccc608de0b4?w=800&q=80',
    },
  },
  {
    id: '서울-영등포',
    name: '여의도/영등포',
    dailyFootTraffic: 160000,
    peakHours: '08:00~20:00',
    targetDemo: '직장인 + 가족 단위. 더현대/IFC몰 쇼핑객 유입',
    nearbyStations: ['여의도역', '영등포역', '여의나루역'],
    hotspots: ['여의도 한강공원', 'IFC몰', '더현대 서울', '영등포 타임스퀘어'],
    recommendation: '여의도 금융 중심지와 더현대/IFC몰이 위치한 복합 상권이에요. 대형 LED 미디어파사드와 쇼핑몰 내 팬 이벤트에 적합해요.',
    statistics: {
      dailyVisitors: 160000,
      subwayDailyUsers: 82000,
      subwayRank: 5,
      externalVisitorRatio: 65,
      stationHighlight: '금융 중심지 + 더현대/IFC몰 복합 상권',
      englishName: 'Yeouido',
      imageUrl: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80',
    },
  },
  {
    id: '서울-용산',
    name: '이태원/용산',
    dailyFootTraffic: 85000,
    peakHours: '12:00~23:00',
    targetDemo: '외국인 + 20~30대 트렌드세터. 다국적 문화 체험 지역',
    nearbyStations: ['이태원역', '녹사평역', '용산역'],
    hotspots: ['이태원 경리단길', '한남동', '용산 HDC', '용산공원'],
    recommendation: '다국적 문화와 한남동 갤러리가 공존하는 트렌디한 지역이에요. 외국인 팬 타겟 이벤트와 프리미엄 팝업에 적합해요.',
    statistics: {
      dailyVisitors: 85000,
      subwayDailyUsers: 42000,
      subwayRank: 9,
      externalVisitorRatio: 70,
      stationHighlight: '다국적 문화 거리, 외국인 팬 이벤트 최적',
      englishName: 'Itaewon',
      imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&q=80',
    },
  },
  {
    id: '서울-광진',
    name: '건대/광진',
    dailyFootTraffic: 120000,
    peakHours: '11:00~22:00',
    targetDemo: '20대 대학생 + 젊은 직장인. 커먼그라운드/스타시티 인근',
    nearbyStations: ['건대입구역', '구의역', '강변역'],
    hotspots: ['커먼그라운드', '건대 로데오거리', '스타시티', '뚝섬유원지'],
    recommendation: '건대입구역은 2호선과 7호선의 환승역으로 젊은 유동인구가 집중되는 지역이에요. 커먼그라운드 팝업과 로데오거리 카페 이벤트에 최적이에요.',
    statistics: {
      dailyVisitors: 120000,
      subwayDailyUsers: 68000,
      subwayRank: 7,
      externalVisitorRatio: 62,
      stationHighlight: '2+7호선 환승, 커먼그라운드 팝업 성지',
      englishName: 'Konkuk Univ.',
      imageUrl: 'https://images.unsplash.com/photo-1551522355-dbf80597eba8?w=800&q=80',
    },
  },
  {
    id: '서울-강남2',
    name: '삼성/COEX',
    dailyFootTraffic: 180000,
    peakHours: '09:00~21:00',
    targetDemo: '비즈니스 + 쇼핑객. COEX/스타필드/SM타운 집객',
    nearbyStations: ['삼성역', '봉은사역', '선릉역'],
    hotspots: ['COEX몰', '스타필드', 'SM타운', '봉은사로'],
    recommendation: 'COEX, 스타필드 등 트렌드 중심지예요. SM타운이 위치해 K-POP 팬덤의 성지이며, 대형 미디어 월과 전시 공간이 풍부해요.',
    statistics: {
      dailyVisitors: 180000,
      subwayDailyUsers: 88000,
      subwayRank: 4,
      externalVisitorRatio: 74,
      stationHighlight: 'COEX/SM타운, K-POP 팬덤의 성지',
      englishName: 'Samsung COEX',
      imageUrl: 'https://images.unsplash.com/photo-1573152958734-1922c188fba3?w=800&q=80',
    },
  },
];

/** 지역 ID로 컨텍스트 조회 */
export function getRegionContext(regionId: string): RegionContext | undefined {
  return regionContexts.find((r) => r.id === regionId);
}

/** 모든 지역 요약 (챗봇 추천용) */
export function getRegionSummaries(): { id: string; name: string; traffic: number; highlight: string }[] {
  return regionContexts.map((r) => ({
    id: r.id,
    name: r.name,
    traffic: r.dailyFootTraffic,
    highlight: r.recommendation.split('.')[0] + '.',
  }));
}

/** 모든 지역 통계 요약 (탐색 페이지용) */
export function getAllRegionStats(): ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly statistics: RegionStatistics;
  readonly highlight: string;
  readonly peakHours: string;
}> {
  return regionContexts.map((r) => ({
    id: r.id,
    name: r.name,
    statistics: r.statistics,
    highlight: r.recommendation.split('.')[0] + '.',
    peakHours: r.peakHours,
  }));
}
