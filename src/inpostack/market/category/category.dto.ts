import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  readonly store_uuid: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;
}

export class CategoryOwnerDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;
}

export class CategoryUpdateDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;
}
