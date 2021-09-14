import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ReviewDto, ReviewUpdateDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  save(dto: ReviewDto) {
    return this.reviewRepo.save(dto);
  }

  find(findOptions?: object) {
    return this.reviewRepo.find(findOptions);
  }

  findOne(findOptions: object, maybeOptions?: object) {
    return this.reviewRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.reviewRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: ReviewUpdateDto) {
    return this.reviewRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.reviewRepo.delete(findOptions);
  }
}
