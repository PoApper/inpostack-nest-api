import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import * as moment from 'moment';
import 'moment-timezone';

import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreRegionType, StoreType } from './store.meta';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { AllowAnonymous } from '../../../auth/decorator/anonymous.decorator';
import randomPick from '../../../utils/randomPick';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { Store } from './store.entity';
import { FavoriteService } from '../favorite/favorite.service';
import findDistance from '../../../utils/findDistance';
import { StoreLogoService } from './store-logo/store-logo.service';
import { parseOpeningHour } from '../../../utils/parseOpeningHour';
import isJson from '../../../utils/jsonCheck';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService,
    private readonly storeLogoService: StoreLogoService,
  ) {}

  @Get('admin_help/fill_all_store_distance')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async fill_all_store_distance() {
    const stores = await this.storeService.find();
    for (const store of stores) {
      const distance: number = await findDistance(store.address1);
      await this.storeService.update(
        { uuid: store.uuid },
        { distance: distance },
      );
    }
  }

  @Post()
  @ApiBody({ type: StoreDto })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async post(@Body() storeDto: StoreDto) {
    if (storeDto.address1) {
      const distance = await findDistance(storeDto.address1);
      Object.assign(storeDto, { distance: distance });
    } else {
      throw new BadRequestException('No address');
    }

    // name check
    const nameExistStore = await this.storeService.findOne({
      name: storeDto.name,
    });
    if (nameExistStore) {
      throw new BadRequestException('Store Name Already Exist');
    }

    return this.storeService.save(storeDto);
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  @ApiQuery({ name: 'order', required: false })
  async getAll(
    @Query('take') take: number,
    @Query('category') category?: boolean,
    @Query('menu') menu?: boolean,
    @Query('order') orderBy?: string,
  ) {
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    const findOptions = {
      order: { created_at: 'DESC' },
      relations: relation_query,
    };
    if (take) {
      Object.assign(findOptions, { take: take });
    }
    if (orderBy == 'name') {
      Object.assign(findOptions, { order: { name: 'ASC' } });
    }
    if (orderBy == 'visit') {
      Object.assign(findOptions, { order: { visit_count: 'DESC' } });
    }
    if (orderBy == 'distance') {
      Object.assign(findOptions, { order: { distance: 'ASC' } });
    }

    const storeArr = await this.storeService.find(findOptions);

    // store open or close
    for (const store of storeArr) {
      if (store['opening_hours'] && isJson(store['opening_hours'])) {
        const openingJSON = JSON.parse(store['opening_hours']);
        store['status'] = parseOpeningHour(openingJSON, new Date());
      } else {
        // 만약 정보가 없다면 'unknown'
        store['status'] = 'unknown';
      }
    }

    return storeArr;
  }

  @Get('name/:store_name')
  @UseGuards(InPoStackAuth)
  @AllowAnonymous()
  async getByStoreName(
    @Req() req,
    @Param('store_name') store_name: string,
    @Query('category') category: boolean,
    @Query('menu') menu: boolean,
  ) {
    const user = req.user;
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    const store: Store = await this.storeService.findOne(
      { name: store_name },
      { relations: relation_query },
    );
    if (!store) throw new BadRequestException('Not Existing Store Name');

    await this.storeService.saveStoreVisitEvent(
      user ? user.uuid : null,
      store.uuid,
    );
    if (user && user.account_type !== AccountType.admin) {
      await this.storeService.plusVisitCount(store.uuid);
    }

    // Calculate Favorite Count by Store
    store['favorite_count'] =
      await this.favoriteService.countUserFavoriteByStore(store.uuid);

    if (user) {
      // store favorite check
      store['is_favorite'] = await this.favoriteService.isFavoriteStore(
        user.uuid,
        store.uuid,
      );

      // menu favorite check
      for (let i = 0; i < store.category.length; i++) {
        for (let j = 0; j < store.category[i].menu.length; j++) {
          const menu = store.category[i].menu[j];
          store.category[i].menu[j]['is_favorite'] =
            await this.favoriteService.isFavoriteMenu(user.uuid, menu.uuid);
        }
      }
    }

    // store open or close
    if (store['opening_hours'] && isJson(store['opening_hours'])) {
      const openingJSON = JSON.parse(store['opening_hours']);
      store['status'] = parseOpeningHour(openingJSON, new Date());
    } else {
      // 만약 정보가 없다면 'unknown'
      store['status'] = 'unknown';
    }
    return store;
  }

  @Get('meta')
  @Public()
  @ApiOperation({
    summary: 'get store meta API',
    description: 'get store meta data',
  })
  getMeta() {
    return {
      store_type: StoreType,
      store_region: StoreRegionType,
    };
  }

  @Get('recommend')
  @Public()
  @ApiOperation({
    summary: 'get recommend store API',
    description: 'get 4 recommendations from top 10 visited store',
  })
  async getRecommendStore() {
    const dateBefore = moment()
      .tz('Asia/Seoul')
      .subtract(1, 'month')
      .format('YYYY-MM-DD');
    const timeNow = moment().tz('Asia/Seoul').format('HH:mm');

    const ret = await this.storeService.getPopularTopNStores(
      dateBefore,
      timeNow,
      10,
    );

    const NUM_OF_RECOMMEND = 3;
    return ret.length <= NUM_OF_RECOMMEND
      ? ret
      : randomPick(ret, NUM_OF_RECOMMEND);
  }

  @Get('random')
  @Public()
  @ApiOperation({
    summary: 'get random store API',
    description: 'get a random store',
  })
  async getRandomStore() {
    const timeNow = moment().tz('Asia/Seoul').format('HH:mm');
    const ret = await this.storeService.getRandomStore(timeNow);
    return ret.length <= 1 ? ret : randomPick(ret, 1);
  }

  @Get(':uuid')
  @UseGuards(InPoStackAuth)
  @AllowAnonymous()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  async getOne(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('category') category: boolean,
    @Query('menu') menu: boolean,
  ) {
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    const store: Store = await this.storeService.findOne(
      { uuid: uuid },
      { relations: relation_query },
    );
    if (!store) throw new BadRequestException('Not Existing Store UUID');

    const user = req.user;
    await this.storeService.saveStoreVisitEvent(user, store.uuid);
    if (user && user.account_type !== AccountType.admin) {
      await this.storeService.plusVisitCount(store.uuid);
    }

    // store open or close
    if (store['opening_hours'] && isJson(store['opening_hours'])) {
      const openingJSON = JSON.parse(store['opening_hours']);
      store['status'] = parseOpeningHour(openingJSON, new Date());
    } else {
      // 만약 정보가 없다면 'unknown'
      store['status'] = 'unknown';
    }

    return store;
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update store API',
    description: '(only for admin) update store information',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async updateOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() storeDto: StoreDto,
  ) {
    const store = await this.storeService.findOne({ uuid: uuid });
    if (!store) throw new BadRequestException('Not exist store');

    if (store.name !== storeDto.name) {
      // name check
      const nameExistStore = await this.storeService.findOne({
        name: storeDto.name,
      });
      if (nameExistStore) {
        throw new BadRequestException('Store Name Already Exist');
      }
    }

    return this.storeService.update({ uuid: uuid }, storeDto);
  }

  @Delete(':uuid')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const store = await this.storeService.findOneOrFail({ uuid: uuid });

    if (store.image_url) {
      await this.storeLogoService.deleteStoreLogoById(uuid);
    }

    // TODO: delete all belonging menu images
    return this.storeService.delete({ uuid: uuid });
  }
}
