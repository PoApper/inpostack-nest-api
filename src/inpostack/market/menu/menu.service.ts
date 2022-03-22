import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { getManager, Repository } from 'typeorm';
import { MenuDto, MenuOwnerDto, MenuUpdateDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
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

  getPopularTopNMenus(dateBefore: string, timeNow: string, limit: number) {
    return getManager().query(`
      SELECT
        menu.name AS menu_uuid,
        menu.name,
        menu.image_url,
        store.uuid AS store_uuid,
        store.name AS store_name
      FROM
        menu
      LEFT JOIN
        store
        ON store.uuid = menu.store_uuid
      WHERE
        store.open_time <= '${timeNow}' AND
        store.close_time >= '${timeNow}' AND
        menu.is_main_menu = TRUE
      LIMIT ${limit}
    `);
  }

  getRandomMenu(timeNow: string) {
    return getManager().query(`
      SELECT
        menu.uuid AS menu_uuid,
        menu.name,
        menu.image_url,
        store.uuid AS store_uuid,
        store.name AS store_name
      FROM
        menu
      LEFT JOIN
        store
        ON store.uuid = menu.store_uuid
      WHERE
        store.open_time <= '${timeNow}' AND
        store.close_time >= '${timeNow}' AND
        menu.is_main_menu = TRUE
    `);
  }
}
