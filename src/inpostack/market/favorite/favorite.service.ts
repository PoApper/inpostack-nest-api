import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuFavorite } from './entity/menu-favorite.entity';
import { StoreFavorite } from './entity/store-favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(MenuFavorite)
    private readonly menuFavoriteRepo: Repository<MenuFavorite>,
    @InjectRepository(StoreFavorite)
    private readonly storeFavoriteRepo: Repository<StoreFavorite>,
  ) {}

  /**
   * Store Favorite Operation
   */

  getAllFavoriteStoreList(user_id: string) {
    return this.storeFavoriteRepo.find({
      user_id: user_id,
    });
  }

  addToFavoriteStoreList(user_id: string, store_id: string) {
    return this.storeFavoriteRepo.save({
      user_id: user_id,
      store_id: store_id,
    });
  }

  removeFromFavoriteStoreList(user_id: string, store_id: string) {
    return this.storeFavoriteRepo.delete({
      user_id: user_id,
      store_id: store_id,
    });
  }

  async isFavoriteStore(user_id: string, store_id: string) {
    const storeFavorite = await this.storeFavoriteRepo.findOne({
      user_id: user_id,
      store_id: store_id,
    });
    return storeFavorite != null;
  }

  /**
   * Menu Favorite Operation
   */

  getAllFavoriteMenuList(user_id: string) {
    return this.menuFavoriteRepo.find({
      user_id: user_id,
    });
  }

  addToFavoriteMenuList(user_id: string, menu_id: string) {
    return this.menuFavoriteRepo.save({
      user_id: user_id,
      menu_id: menu_id,
    });
  }

  removeFromFavoriteMenuList(user_id: string, menu_id: string) {
    return this.menuFavoriteRepo.delete({
      user_id: user_id,
      menu_id: menu_id,
    });
  }

  async isFavoriteMenu(user_id: string, menu_id: string) {
    const menuFavorite = await this.menuFavoriteRepo.findOne({
      user_id: user_id,
      menu_id: menu_id,
    });
    return menuFavorite != null;
  }
}
