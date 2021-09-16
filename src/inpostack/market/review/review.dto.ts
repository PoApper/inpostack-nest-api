import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly reviewer_uuid: string;

  @ApiProperty()
  readonly store_uuid: string;
}

export class ReviewUpdateDto {
  @ApiProperty()
  readonly  content: string;
}