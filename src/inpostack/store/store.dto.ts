import { ApiProperty } from '@nestjs/swagger';
import { StoreType } from "./store.meta";

export class StoreDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({enum: StoreType, description: "store type (ex: KOREAN, SEA FOOD, ... "})
  readonly store_type: StoreType;

  @ApiProperty()
  readonly location: string;

  @ApiProperty()
  readonly open_time: number; // HHMM

  @ApiProperty()
  readonly close_time: number; // HHMM

  @ApiProperty()
  readonly menu: JSON;
}