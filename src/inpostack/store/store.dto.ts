import { ApiProperty } from '@nestjs/swagger';

export class StoreDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly location: string;

  @ApiProperty()
  readonly open_time: number; // HHMM

  @ApiProperty()
  readonly close_time: number; // HHMM

  @ApiProperty()
  readonly menu: JSON;
}