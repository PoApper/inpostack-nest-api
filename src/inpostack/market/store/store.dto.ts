import { ApiProperty } from '@nestjs/swagger';
import { StoreRegionType, StoreType } from './store.meta';

export class StoreDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({
    enum: StoreType,
    description: 'store type (ex: KOREAN, SEA FOOD, ... )',
  })
  readonly store_type: StoreType;

  @ApiProperty()
  readonly address1: string;

  @ApiProperty()
  readonly address2: string;

  @ApiProperty()
  readonly zipcode: number;

  @ApiProperty()
  readonly open_time: string; // HH:MM

  @ApiProperty()
  readonly close_time: string; // HH:MM

  @ApiProperty()
  readonly naver_map_url: string;

  @ApiProperty()
  readonly kakao_map_url: string;

  @ApiProperty()
  readonly label: string;

  @ApiProperty({
    enum: StoreRegionType,
    description: 'region type: 효자(hyo-ja), 지곡(ji-gok), ...',
  })
  readonly region: StoreRegionType;

  @ApiProperty()
  readonly owner_uuid?: string; // uuid of owner account (it can be null)
}
