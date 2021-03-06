import { ApiProperty } from '@nestjs/swagger';
import { StoreType } from './store.meta';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

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
  readonly owner_uuid?: string; // uuid of owner account (it can be null)

  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB
  readonly store_image?: MemoryStoredFile;
}
