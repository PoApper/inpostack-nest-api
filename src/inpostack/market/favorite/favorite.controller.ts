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
   * Store Favorite API
   */

  @Get('store')
  @UseGuards(InPoStackAuth)
  async getMyFavoriteStoreList(@Req() req) {
    const user = req.user;
    return this.favoriteService.getAllFavoriteStoreList(user.uuid);
  }

  @Post('store/:store_uuid')
  @UseGuards(InPoStackAuth)
  async addToFavoriteStoreList(
    @Req() req,
    @Param('menu_uuid') menu_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.addToFavoriteStoreList(user.uuid, menu_uuid);
  }

  @Delete('store/:store_uuid')
  @UseGuards(InPoStackAuth)
  async deleteFromFavoriteStoreList(
    @Req() req,
    @Param('menu_uuid') menu_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.removeFromFavoriteStoreList(
      user.uuid,
      menu_uuid,
    );
  }

  /**
   * Menu Favorite API
   */

  @Get('menu')
  @UseGuards(InPoStackAuth)
  async getMyFavoriteMenuList(@Req() req) {
    const user = req.user;
    return this.favoriteService.getAllFavoriteMenuList(user.uuid);
  }

  @Post('menu/:menu_uuid')
  @UseGuards(InPoStackAuth)
  async addToFavoriteMenuList(
    @Req() req,
    @Param('menu_uuid') menu_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.addToFavoriteMenuList(user.uuid, menu_uuid);
  }

  @Delete('menu/:menu_uuid')
  @UseGuards(InPoStackAuth)
  async deleteFromFavoriteMenuList(
    @Req() req,
    @Param('menu_uuid') menu_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.removeFromFavoriteMenuList(
      user.uuid,
      menu_uuid,
    );
  }
}
