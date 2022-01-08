import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createQueryBuilder } from 'typeorm';
import { getRegExp } from 'korean-regexp';

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
    const searchRegExp = search ? getRegExp(search) : null;   // return format: '/[]/'
    const searchRegExpString = String(searchRegExp).split('/')[1];    //  SQL format: '[]'
    const Menus = await createQueryBuilder('menu')
      .select(['name', 'description'])
      .where(`name REGEXP '${searchRegExpString}'`)
      .andWhere('is_main_menu = TRUE')
      .getRawMany();
    const Stores = await createQueryBuilder('store')
      .select(['name', 'description'])
      .where(`name REGEXP '${searchRegExpString}'`)
      .getRawMany();
    return Object.assign({}, { Menus, Stores });
  }
}