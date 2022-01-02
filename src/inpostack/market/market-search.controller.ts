import { MenuService } from './menu/menu.service';
import { StoreService } from './store/store.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createQueryBuilder } from 'typeorm';

@ApiTags('Market Search')
@Controller('market-search')
export class MarketSearchController {
  @Get()
  @ApiQuery({name: 'search', required: false})
  @ApiOperation({
    summary: 'autocomplete',
    description: 'autocomplete the input word'
  })
  async autocomplete(@Query('search') search?: string){
    const Menus = await createQueryBuilder('menu')
      .select(['name', 'description'])
      .where(`name like '%${search}%'`)
      .getRawMany();
    const Stores = await createQueryBuilder('store')
      .select(['name', 'description'])
      .where(`name like '%${search}%'`)
      .getRawMany();
    return Object.assign({}, { Menus, Stores });
  }
}