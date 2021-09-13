import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { getManager } from 'typeorm';
import { FormDataRequest } from 'nestjs-form-data';
import * as moment from 'moment';

import { MenuDto, MenuOwnerDto, MenuUpdateDto } from './menu.dto';
import { MenuService } from './menu.service';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { CategoryService } from '../category/category.service';
import { FileService } from '../../../file/file.service';
import randomPick from '../../../utils/randomPick';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiBody({ type: MenuDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async post(@Body() dto: MenuDto) {
    await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
      store_uuid: dto.store_uuid,
    });

    const { menu_img, ...saveDto } = dto;

    const menu = await this.menuService.save(saveDto);

    if (menu_img) {
      const img_key = `menu/logo/${menu.uuid}/${moment(Date.now()).format(
        'YYYYMMDDHHmm',
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, menu_img);
      await this.menuService.update(
        { uuid: menu.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    }

    return menu;
  }

  @Post('owner')
  @ApiBody({ type: MenuOwnerDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @FormDataRequest()
  async postByOwner(@Req() req, @Body() dto: MenuOwnerDto) {
    const store = req.user.store;
    const { menu_img, ...saveDto } = dto;

    const menu = await this.menuService.save(
      Object.assign(saveDto, { store_uuid: store.uuid }),
    );

    if (menu_img) {
      const img_key = `menu/logo/${menu.uuid}/${moment(Date.now()).format(
        'YYYYMMDDHHmm',
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, menu_img);
      await this.menuService.update(
        { uuid: menu.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    }

    return menu;
  }

  @Get()
  getAll() {
    return this.menuService.findAll();
  }

  @Get('owner')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  getAllByOwner(@Req() req) {
    const store = req.user.store;
    return this.menuService.findAll({ store_uuid: store.uuid });
  }

  @Get('recommend')
  @ApiOperation({
    summary: 'get recommend menu API',
    description: 'get 4 recommendations from main menu',
  })
  async getRecommendMenu() {
    const dateTimeUTC = new Date();
    const dateTime = new Date(dateTimeUTC.setHours(dateTimeUTC.getHours() + 9));
    const timeNow = dateTime.toISOString().substr(11, 5);
    const entityManager = getManager();
    const ret = await entityManager.query(`
      SELECT
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
        menu.is_main_menu = TRUE AND
        menu.like > menu.hate
    `);

    const NUM_OF_RECOMMEND = 4;
    return ret.length <= NUM_OF_RECOMMEND
      ? ret
      : randomPick(ret, NUM_OF_RECOMMEND);
  }

  @Get('random')
  @ApiOperation({
    summary: 'get random menu API',
    description: 'get a random menu',
  })
  async getRandomMenu() {
    const dateTimeUTC = new Date();
    const dateTime = new Date(dateTimeUTC.setHours(dateTimeUTC.getHours() + 9));
    const timeNow = dateTime.toISOString().substr(11, 5);
    const entityManager = getManager();
    const ret = await entityManager.query(`
      SELECT
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
    return ret.length <= 1 ? ret : randomPick(ret, 1);
  }

  @Get(':uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.menuService.findOne({ uuid: uuid });
  }

  @Put(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async putOne(@Param('uuid') uuid: string, @Body() dto: MenuUpdateDto) {
    const category = await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
    });
    const menu = await this.menuService.findOneOrFail({
      uuid: uuid,
      category_uuid: dto.category_uuid,
      store_uuid: category.store_uuid,
    });

    const { menu_img, ...saveDto } = dto;

    if (menu_img) {
      if (menu.image_url) {
        const deleteKey = menu.image_url.split('/').slice(3).join('/');
        this.fileService.deleteFile(deleteKey);
      }
      const img_key = `menu/logo/${menu.uuid}/${moment(Date.now()).format(
        'YYYYMMDDHHmm',
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, menu_img);
      return this.menuService.update(
        { uuid: menu.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    } else {
      return this.menuService.update({ uuid: uuid }, saveDto);
    }
  }

  @Put('owner/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @FormDataRequest()
  async putOneByOwner(
    @Req() req,
    @Param('uuid') uuid: string,
    @Body() dto: MenuOwnerDto,
  ) {
    const store = req.user.store;
    const menu = await this.menuService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });
    await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
      store_uuid: store.uuid,
    });

    const { menu_img, ...saveDto } = dto;

    if (menu_img) {
      if (menu.image_url) {
        const deleteKey = menu.image_url.split('/').slice(3).join('/');
        this.fileService.deleteFile(deleteKey);
      }
      const img_key = `menu/logo/${menu.uuid}/${moment(Date.now()).format(
        'YYYYMMDDHHmm',
      )}`;
      const logo_url = await this.fileService.uploadFile(img_key, menu_img);
      return this.menuService.update(
        { uuid: menu.uuid },
        Object.assign(saveDto, { image_url: logo_url }),
      );
    } else {
      return this.menuService.update({ uuid: uuid }, saveDto);
    }
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Param('uuid') uuid: string) {
    const menu = await this.menuService.findOneOrFail({ uuid: uuid });
    if (menu.image_url) {
      const deleteKey = menu.image_url.split('/').slice(3).join('/');
      this.fileService.deleteFile(deleteKey);
    }
    return this.menuService.delete({ uuid: uuid });
  }

  @Delete('owner/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  async deleteOneByOwner(@Req() req, @Param('uuid') uuid: string) {
    const store = req.user.store;
    const menu = await this.menuService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });
    if (menu.image_url) {
      const deleteKey = menu.image_url.split('/').slice(3).join('/');
      this.fileService.deleteFile(deleteKey);
    }
    return this.menuService.delete({ uuid: uuid });
  }
}
