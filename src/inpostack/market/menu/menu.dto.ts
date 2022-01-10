import { ApiProperty } from '@nestjs/swagger';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class MenuDto {
  @ApiProperty()
  readonly category_uuid: string;

  @ApiProperty()
  readonly store_uuid: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly is_main_menu: boolean;

  @ApiProperty()
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB
  readonly menu_image?: MemoryStoredFile;
}

export class MenuUpdateDto {
  @ApiProperty()
  readonly category_uuid: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly is_main_menu: boolean;

  @ApiProperty()
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB
  readonly menu_image?: MemoryStoredFile;
}

/**
 * dto only for store-owner
 */

export class MenuOwnerDto {
  @ApiProperty()
  readonly category_uuid: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly is_main_menu: boolean;

  @ApiProperty()
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB
  readonly menu_image?: MemoryStoredFile;
}
