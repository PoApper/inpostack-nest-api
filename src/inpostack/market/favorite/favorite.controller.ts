import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { FavoriteService } from './favorite.service';

@ApiTags('즐겨찾기(favorite)')
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Menu Favorite API
   */

  @Get('menu')
  @UseGuards(InPoStackAuth)
  async getMyFavoriteList(@Req() req) {
    const user = req.user;
    return this.favoriteService.getAllFavoriteList(user.uuid);
  }

  @Post('menu/:menu_uuid')
  @UseGuards(InPoStackAuth)
  async addToFavoriteList(@Req() req, @Param('menu_uuid') menu_uuid: string) {
    const user = req.user;
    return this.favoriteService.addToFavoriteList(user.uuid, menu_uuid);
  }

  @Delete('menu/:menu_uuid')
  @UseGuards(InPoStackAuth)
  async deleteFromFavoriteList(
    @Req() req,
    @Param('menu_uuid') menu_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.removeFromFavoriteList(user.uuid, menu_uuid);
  }
}
