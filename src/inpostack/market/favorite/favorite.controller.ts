import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { FavoriteService } from './favorite.service';
import { AccountType } from '../../account/account.meta';
import { Account } from '../../account/account.entity';

@ApiTags('즐겨찾기(favorite)')
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Store Favorite API
   */

  @Get('store')
  @UseGuards(InPoStackAuth)
  async getMyFavoriteStoreList(@Req() req, @Query('user_id') user_id: string) {
    const user: Account = req.user;

    // For non-admin user, only get their own
    if (
      user.account_type !== AccountType.admin &&
      user_id !== null &&
      user.uuid !== user_id
    ) {
      throw new UnauthorizedException('Bad Authentication');
    } else {
      const target_user_id = user_id ?? user.uuid;
      return this.favoriteService.getAllFavoriteStoreList(target_user_id);
    }
  }

  @Post('store/:store_uuid')
  @UseGuards(InPoStackAuth)
  async addToFavoriteStoreList(
    @Req() req,
    @Param('store_uuid') store_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.addToFavoriteStoreList(user.uuid, store_uuid);
  }

  @Delete('store/:store_uuid')
  @UseGuards(InPoStackAuth)
  async deleteFromFavoriteStoreList(
    @Req() req,
    @Param('store_uuid') store_uuid: string,
  ) {
    const user = req.user;
    return this.favoriteService.removeFromFavoriteStoreList(
      user.uuid,
      store_uuid,
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
