import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto, ReviewUpdateDto } from './review.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiBody({type: ReviewDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.user, AccountType.storeOwner, AccountType.admin)
  post(@Body() dto: ReviewDto) {
    return this.reviewService.save(dto);
  }

  @Get()
  getAll() {
    return this.reviewService.find({order: {created_at: 'DESC'}});
  }

  @Get('reviewer/:reviewer_uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.user, AccountType.storeOwner, AccountType.admin)
  getAllByReviewer(@Param('reviewer_uuid') reviewer_uuid: string) {
    return this.reviewService.find({reviewer_uuid: reviewer_uuid});
  }

  @Get('`store/:store_uuid`')
  getAllByStore(@Param('store_uuid') store_uuid: string) {
    return this.reviewService.find({store_uuid: store_uuid});
  }

  @Get(':uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.reviewService.findOne({uuid: uuid});
  }

  @Put('reviewer/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.user, AccountType.storeOwner, AccountType.admin)
  async updateOwnReview(@Req() req, @Param('uuid') uuid: string, @Body() dto: ReviewUpdateDto) {
    const user = req.user;
    const review = await this.reviewService.findOneOrFail({uuid: uuid});
    if (user.uuid === review.reviewer_uuid) {
      return this.reviewService.update({uuid: uuid}, dto);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async update(@Param('uuid') uuid: string, @Body() dto: ReviewDto) {
    await this.reviewService.findOneOrFail({uuid: uuid});
    return this.reviewService.update({uuid: uuid}, dto);
  }

  @Delete('reviewer/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.user, AccountType.storeOwner, AccountType.admin)
  async deleteOwnReview(@Req() req, @Param('uuid') uuid: string) {
    const user = req.user;
    const review = await this.reviewService.findOneOrFail({uuid: uuid});
    if (user.uuid === review.reviewer_uuid) {
      return this.reviewService.delete({uuid: uuid});
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async delete(@Param('uuid') uuid: string) {
    await this.reviewService.findOneOrFail({uuid: uuid});
    return this.reviewService.delete({uuid: uuid});
  }
}
