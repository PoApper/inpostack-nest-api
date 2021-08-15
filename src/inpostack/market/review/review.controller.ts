import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}
