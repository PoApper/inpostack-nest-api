import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getManager } from 'typeorm';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'nest-keycloak-connect';
import * as path from 'path';

import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreType } from './store.meta';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { AllowAnonymous } from '../../../auth/decorator/anonymous.decorator';
import randomPick from '../../../utils/randomPick';
import { FileService } from '../../../file/file.service';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';
import { Store } from './store.entity';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiBody({ type: StoreDto })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async post(@Body() dto: StoreDto) {
    const { store_image, ...saveDto } = dto;

    const store = await this.storeService.save(saveDto);

    if (store_image) {
      const img_key = `store/logo/${store.uuid}${path.extname(
        store_image.originalName,
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, store_image);
      await this.storeService.update(
        { uuid: store.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    }
    return store;
  }

  @Get()
  @Public()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  getAll(
    @Query('take') take: number,
    @Query('category') category?: boolean,
    @Query('menu') menu?: boolean,
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
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    const store: Store = await this.storeService.findOne(
      { name: store_name },
      { relations: relation_query },
    );
    if (!store) throw new BadRequestException('Not Existing Store Name');

    this.storeService.saveStoreVisitEvent(req.user, store.uuid);
    this.storeService.plusVisitCount(store.uuid);

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
    };
  }

  @Get('recommend')
  @Public()
  @ApiOperation({
    summary: 'get recommend store API',
    description: 'get 4 recommendations from top 10 visited store',
  })
  async getRecommendStore() {
    const dateTimeUTC = new Date();
    const dateTime = new Date(dateTimeUTC.setHours(dateTimeUTC.getHours() + 9));
    const timeNow = dateTime.toISOString().substr(11, 5);
    const dateBefore = new Date(
      dateTimeUTC.setMonth(dateTimeUTC.getMonth() - 1),
    );
    const entityManager = getManager();
    const ret = await entityManager.query(`
      SELECT
        store_visit_event.store_uuid,
        store.name,
        store.image_url,
        COUNT(*) AS total_visit_user
      FROM
        store_visit_event
      LEFT JOIN
        store
        ON store.uuid = store_visit_event.store_uuid
      WHERE
        DATE(store_visit_event.visited_at) > ${
          dateBefore.toISOString().split('T')[0]
        } AND
        store.open_time <= '${timeNow}' AND
        store.close_time >= '${timeNow}'
      GROUP BY
        1, 2, 3
      ORDER BY
        total_visit_user DESC
      LIMIT 10
    `);

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
    const dateTimeUTC = new Date();
    const dateTime = new Date(dateTimeUTC.setHours(dateTimeUTC.getHours() + 9));
    const timeNow = dateTime.toISOString().substr(11, 5);
    const entityManager = getManager();
    const ret = await entityManager.query(`
      SELECT
        store.uuid AS store_uuid,
        store.name,
        store.image_url
      FROM
        store
      WHERE
        store.open_time <= '${timeNow}' AND
        store.close_time >= '${timeNow}'
    `);
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
  async updateOwnStore(@Req() req, @Body() dto: StoreDto) {
    const store = req.user.store;
    const { store_image, ...saveDto } = dto;

    if (store_image) {
      if (store.image_url) {
        const deleteKey = store.image_url.split('/').slice(3).join('/');
        this.fileService.deleteFile(deleteKey);
      }
      const img_key = `store/logo/${store.uuid}${path.extname(
        store_image.originalName,
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, store_image);
      return this.storeService.update(
        { uuid: store.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    } else {
      return this.storeService.update({ uuid: store.uuid }, dto);
    }
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update store API',
    description: '(only for admin) update store information',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async updateOne(@Param('uuid') uuid: string, @Body() dto: StoreDto) {
    const { store_image, ...saveDto } = dto;
    const store = await this.storeService.findOne({ uuid: uuid });

    if (store_image) {
      if (store.image_url) {
        const deleteKey = store.image_url.split('/').slice(3).join('/');
        this.fileService.deleteFile(deleteKey);
      }
      const img_key = `store/logo/${store.uuid}${path.extname(
        store_image.originalName,
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, store_image);
      return this.storeService.update(
        { uuid: store.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    } else {
      return this.storeService.update({ uuid: store.uuid }, saveDto);
    }
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
