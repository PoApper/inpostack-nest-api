import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuFavorite } from './entity/menu-favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(MenuFavorite)
    private readonly menuFavoriteRepo: Repository<MenuFavorite>,
  ) {}

  /**
   * Menu Favorite Operation
   */

  getAllFavoriteList(user_id) {
    return this.menuFavoriteRepo.find({
      user_id: user_id,
    });
  }

  addToFavoriteList(user_id: string, menu_id: string) {
    return this.menuFavoriteRepo.save({
      user_id: user_id,
      menu_id: menu_id,
    });
  }

  removeFromFavoriteList(user_id: string, menu_id: string) {
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
