/**
 * WARN: Recommend not to remove type,
 * just tag it as deprecated
 */

export enum StoreType {
  korean = 'KOREAN', // 한식, 정식
  japanese = 'JAPANESE', // 일식
  chinese = 'CHINESE', // 중식
  chicken = 'CHICKEN', // 치킨
  hamburger = 'HAMBURGER', // 햄버거
  pizza = 'PIZZA', // 피자
  snack_shop = 'SNACK_SHOP', // 분식
  sea_food = 'SEA_FOOD', // 해산물
  dessert = 'DESSERT', // 디저트
  korean_stew = 'KOREAN_STEW', // 찌개류. 국밥
  western = 'WESTERN', // 양식
  bossam = 'BOSSAM', // 고기, 보쌈
  etc = 'ETC',
}

// TODO: integrate later!
export enum StoreSortOption {
  name = 'name',
  visit = 'visit',
  distance = 'distance',
  updated = 'updated',
  created = 'created',
}

export enum StoreRegionType {
  hyoja = 'hyo-ja',
  skview = 'sk-view',
  yugang = 'yu-gang',
  yidong = 'yi-dong',
  jigok = 'ji-gok',
  others = 'others',
}
