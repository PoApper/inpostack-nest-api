import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'nest-keycloak-connect';
import * as moment from 'moment';
import 'moment-timezone';

import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreRegionType, StoreType } from './store.meta';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { AllowAnonymous } from '../../../auth/decorator/anonymous.decorator';
import randomPick from '../../../utils/randomPick';
import { FileService } from '../../../file/file.service';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { Store } from './store.entity';
import { FavoriteService } from '../favorite/favorite.service';
import findDistance from '../../../utils/findDistance';
import { StoreLogoDto } from './store-logo.dto';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService,
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

    return this.storeService.save(storeDto);
  }

  @Post('logo/:store_id')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async registerStoreLogo(
    @Param('store_id') store_id: string,
    @Body() storeLogoDto: StoreLogoDto,
  ) {
    const { store_logo } = storeLogoDto;
    if (!store_logo) throw new BadRequestException('invalid logo');

    const store = await this.storeService.findOne({ uuid: store_id });
    if (!store) throw new BadRequestException('Not exist store');

    const logoKey = `store/logo/${store_id}`;
    const logoUrl = await this.fileService.uploadFile(logoKey, store_logo);

    await this.storeService.update({ uuid: store_id }, { image_url: logoUrl });
    return logoUrl;
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  @ApiQuery({ name: 'order', required: false })
  getAll(
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

    return this.storeService.find(findOptions);
  }

  @Get('owner')
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.storeOwner)
  getOwnStore(
    @Req() req,
    @Query('category') category: boolean,
    @Query('menu') menu: boolean,
  ) {
    const user = req.user;
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    return this.storeService.findOneOrFail(
      { owner_uuid: user.uuid },
      { relations: relation_query },
    );
  }

  @Get('owner/:owner_uuid')
  @Public()
  getByOwner(@Param('owner_uuid') owner_uuid: string) {
    return this.storeService.findOneOrFail({ owner_uuid: owner_uuid });
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

    this.storeService.saveStoreVisitEvent(user ? user.uuid : null, store.uuid);
    this.storeService.plusVisitCount(store.uuid);

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
    @Param('uuid') uuid: string,
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

    this.storeService.saveStoreVisitEvent(req.user, store.uuid);
    this.storeService.plusVisitCount(store.uuid);

    return store;
  }

  @Put('owner')
  @ApiOperation({
    summary: 'update own store API',
    description: 'update store information using auth token',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @FormDataRequest()
  async updateOwnStore(@Req() req, @Body() storeDto: StoreDto) {
    const store = req.user.store;
    return this.storeService.update({ uuid: store.uuid }, storeDto);
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update store API',
    description: '(only for admin) update store information',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async updateOne(@Param('uuid') uuid: string, @Body() storeDto: StoreDto) {
    const store = await this.storeService.findOne({ uuid: uuid });
    if (!store) throw new BadRequestException('Not exist store');

    return this.storeService.update({ uuid: uuid }, storeDto);
  }

  @Delete(':uuid')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Param('uuid') uuid: string) {
    const store = await this.storeService.findOneOrFail({ uuid: uuid });

    if (store.image_url) {
      const deleteKey = store.image_url.split('/').slice(3).join('/');
      this.fileService.deleteFile(deleteKey);
    }

    // TODO: delete all belonging menu images

    return this.storeService.delete({ uuid: uuid });
  }
}
