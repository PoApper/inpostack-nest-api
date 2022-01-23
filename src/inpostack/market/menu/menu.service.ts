import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { Repository } from 'typeorm';
import { MenuDto, MenuOwnerDto, MenuUpdateDto } from './menu.dto';
import { MenuFavorite } from './entity/menu-favorite.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(MenuFavorite)
    private readonly menuFavoriteRepo: Repository<MenuFavorite>,
  ) {}

  async save(dto: MenuDto | MenuOwnerDto) {
    return this.menuRepo.save(dto);
  }

  findAll(findOptions?: object) {
    return this.menuRepo.find(findOptions);
  }

  findOne(findOptions: object, maybeOptions?: object) {
    return this.menuRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.menuRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: MenuUpdateDto | object) {
    return this.menuRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.menuRepo.delete(findOptions);
  }

  /**
   * Menu Favorite Operation
   */

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
}
