import {
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { FavoriteService } from './favorite.service';
import { AccountType } from '../../account/account.meta';
import { Account } from '../../account/account.entity';
import { StoreService } from '../store/store.service';

@ApiTags('즐겨찾기(favorite)')
@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    @Inject(forwardRef(() => StoreService))
    private readonly storeService: StoreService,
  ) {}

  /**
   * Store Favorite API
   */

  @Get('store')
  @ApiQuery({ name: 'user_id', required: false })
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
      const storeFavoriteList =
        await this.favoriteService.getAllFavoriteStoreByUser(target_user_id);
      const storeList = [];
      for (const storeFavorite of storeFavoriteList) {
        const store = await this.storeService.findOne({
          uuid: storeFavorite.store_id,
        });
        storeList.push(store);
      }
      return storeList;
    }
  }

  @Post('store/:store_uuid')
  @UseGuards(InPoStackAuth)
  async addToFavoriteStoreList(
    @Req() req,
    @Param('store_uuid', ParseUUIDPipe) store_uuid: string,
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
   * Menu Favorite API (Deprecated)
   */

  // @Get('menu')
  // @UseGuards(InPoStackAuth)
  // async getMyFavoriteMenuList(@Req() req) {
  //   const user = req.user;
  //   return this.favoriteService.getAllFavoriteMenuList(user.uuid);
  // }
  //
  // @Post('menu/:menu_uuid')
  // @UseGuards(InPoStackAuth)
  // async addToFavoriteMenuList(
  //   @Req() req,
  //   @Param('menu_uuid', ParseUUIDPipe) menu_uuid: string,
  // ) {
  //   const user = req.user;
  //   return this.favoriteService.addToFavoriteMenuList(user.uuid, menu_uuid);
  // }
  //
  // @Delete('menu/:menu_uuid')
  // @UseGuards(InPoStackAuth)
  // async deleteFromFavoriteMenuList(
  //   @Req() req,
  //   @Param('menu_uuid', ParseUUIDPipe) menu_uuid: string,
  // ) {
  //   const user = req.user;
  //   return this.favoriteService.removeFromFavoriteMenuList(
  //     user.uuid,
  //     menu_uuid,
  //   );
  // }
}
