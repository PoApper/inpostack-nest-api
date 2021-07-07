import { ApiProperty } from "@nestjs/swagger";

export class CategoryCreateDto {
  @ApiProperty()
  readonly store_uuid: string;
  
  @ApiProperty()
  readonly name: string;
}

export class CategoryUpdateDto {
  @ApiProperty()
  readonly name: string;
}