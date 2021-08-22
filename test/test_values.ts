import { StoreDto } from '../src/inpostack/market/store/store.dto';
import { StoreType } from '../src/inpostack/market/store/store.meta';
import { NoticeDto } from '../src/inpostack/notice/notice.dto';
import { NoticeType } from '../src/inpostack/notice/notice.meta';
import { AccountCreateDto } from '../src/inpostack/account/account.dto';
import {
  AccountStatus,
  AccountType,
} from '../src/inpostack/account/account.meta';

export const userDto1: AccountCreateDto = {
  email: 'phoenix@example.com',
  name: '포닉스',
  id: 'phoenix',
  password: 'phoenix1986',
  account_type: AccountType.user,
  account_status: AccountStatus.activated,
};

export const storeOwnerDto1: AccountCreateDto = {
  email: 'owner@example.com',
  name: '테스트 점주',
  id: 'owner',
  password: 'owner1986',
  account_type: AccountType.storeOwner,
  account_status: AccountStatus.activated,
};

export const storeDto1: StoreDto = {
  name: '무은재기념관',
  phone: '010-0000-0000',
  description: '학문에는 경계가 없다',
  store_type: StoreType.korean,
  address1: '경상북도 포항시 남구 청암로 77(지곡동)',
  address2: '기숙사 1동 101호',
  zipcode: 12345,
  open_time: '12:00',
  close_time: '18:00',
};

export const storeDto2: StoreDto = {
  name: '박태준 학술정보관',
  phone: '010-1111-1111',
  description: '자원은 유한하지만, 창의는 무한하다',
  store_type: StoreType.korean,
  address1: '경상북도 포항시 남구 청암로 77(지곡동)',
  address2: '기숙사 1동 101호',
  zipcode: 12345,
  open_time: '12:30',
  close_time: '18:30',
};

export const noticeDto1: NoticeDto = {
  title: '테스트 공지',
  content: '테스트 공지입니다.',
  notice_type: NoticeType.global,
};
