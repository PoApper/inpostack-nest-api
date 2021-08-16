import { ApiProperty } from '@nestjs/swagger';

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
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @ApiProperty()
  readonly image_url?: string;
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
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @ApiProperty()
  readonly image_url?: string;
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
  readonly like: number;

  @ApiProperty()
  readonly hate: number;

  @ApiProperty()
  readonly image_url?: string;
}
