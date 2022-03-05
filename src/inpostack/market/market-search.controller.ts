import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createQueryBuilder } from 'typeorm';
import { getRegExp } from 'korean-regexp';
import { Menu } from './menu/menu.entity';
import { Store } from './store/store.entity';

@ApiTags('Market Search')
@Controller('market-search')
export class MarketSearchController {
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({
    summary: '가게/메뉴 검색',
  })
  async autocomplete(@Query('search') search?: string) {
    const searchRegExp = search ? getRegExp(search) : null; // return format: '/[]/'
    const searchRegExpString = String(searchRegExp).split('/')[1]; //  SQL format: '[]'

    const Stores = await createQueryBuilder('store')
      .select(['uuid', 'name', 'description', 'image_url'])
      .where(`name REGEXP '${searchRegExpString}'`)
      .getRawMany();

    const Menus = await createQueryBuilder(Menu, 'menu')
      .leftJoinAndSelect(Store, 'store', 'store.uuid = menu.store_uuid')
      .select([
        'menu.uuid AS uuid',
        'menu.name AS name',
        'menu.price AS price',
        'menu.image_url AS image_url',
        'store.name AS store_name',
        'store.image_url AS store_image_url',
      ])
      .where(`menu.name REGEXP '${searchRegExpString}'`)
      .andWhere('menu.is_main_menu = TRUE')
      .getRawMany();
    return Object.assign({}, { Stores, Menus });
  }
}
