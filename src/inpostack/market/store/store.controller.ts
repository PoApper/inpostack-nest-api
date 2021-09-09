import {
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
import { AuthGuard } from '@nestjs/passport';
import { getManager } from 'typeorm';
import { FormDataRequest } from 'nestjs-form-data';

import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreType } from './store.meta';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { JwtGuard } from '../../../auth/guard/jwt.guard';
import { AllowAnonymous } from '../../../auth/decorator/anonymous.decorator';
import randomPick from '../../../utils/randomPick';
import { FileService } from '../../../file/file.service';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiBody({ type: StoreDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async post(@Body() dto: StoreDto) {
    const { store_img, ...saveDto } = dto;

    const store = await this.storeService.save(saveDto);

    if (store_img) {
      const logo_url = await this.fileService.uploadFile(
        'store/logo',
        store_img,
        store.uuid,
      );
      await this.storeService.update(
        { uuid: store.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    }
    return store;
  }

  @Get()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  getAll(@Query('category') category?: boolean, @Query('menu') menu?: boolean) {
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    return this.storeService.find({
      order: { created_at: 'DESC' },
      relations: relation_query,
    });
  }

  @Get('owner')
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
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
  getByOwner(@Param('owner_uuid') owner_uuid: string) {
    return this.storeService.findOneOrFail({ owner_uuid: owner_uuid });
  }

  @Get('name/:store_name')
  @UseGuards(JwtGuard)
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

    const store = await this.storeService.findOne(
      { name: store_name },
      { relations: relation_query },
    );

    this.storeService.saveEvent(req.user, store.uuid);

    return store;
  }

  @Get('meta')
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
        store_visit.store_uuid,
        store.name,
        store.image_url,
        COUNT(*) AS total_visit_user
      FROM
        store_visit
      LEFT JOIN
        store
        ON store.uuid = store_visit.store_uuid
      WHERE
        DATE(store_visit.visited_at) > ${
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

    const NUM_OF_RECOMMEND = 4;
    return ret.length <= NUM_OF_RECOMMEND
      ? ret
      : randomPick(ret, NUM_OF_RECOMMEND);
  }

  @Get('random')
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
  @UseGuards(JwtGuard)
  @AllowAnonymous()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'menu', required: false })
  getOne(
    @Req() req,
    @Param('uuid') uuid: string,
    @Query('category') category: boolean,
    @Query('menu') menu: boolean,
  ) {
    const relation_query = [];
    if (category) relation_query.push('category');
    if (category && menu) relation_query.push('category.menu');

    this.storeService.saveEvent(req.user, uuid);

    return this.storeService.findOne(
      { uuid: uuid },
      { relations: relation_query },
    );
  }

  @Put('owner')
  @ApiOperation({
    summary: 'update own store API',
    description: 'update store information using auth token',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @FormDataRequest()
  async updateOwnStore(@Req() req, @Body() dto: StoreDto) {
    const store = req.user.store;
    const { store_img, ...saveDto } = dto;

    if (store_img) {
      const logo_url = await this.fileService.uploadFile(
        'store/logo',
        store_img,
        store.uuid,
      );
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
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async updateOne(@Param('uuid') uuid: string, @Body() dto: StoreDto) {
    const { store_img, ...saveDto } = dto;
    const store = await this.storeService.findOne({ uuid: uuid });

    if (store_img) {
      const logo_url = await this.fileService.uploadFile(
        'store/logo',
        store_img,
        store.uuid,
      );
      return this.storeService.update(
        { uuid: store.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    } else {
      return this.storeService.update({ uuid: store.uuid }, dto);
    }
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  deleteOne(@Param('uuid') uuid: string) {
    return this.storeService.delete({ uuid: uuid });
  }
}
