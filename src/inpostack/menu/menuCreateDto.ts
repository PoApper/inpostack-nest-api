import { ApiProperty } from "@nestjs/swagger";

export class MenuCreateDto {
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

export class MenuUpdateDto {
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