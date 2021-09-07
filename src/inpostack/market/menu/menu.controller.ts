import * as fs from 'fs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { getManager } from 'typeorm';

import { MenuDto, MenuOwnerDto, MenuUpdateDto } from './menu.dto';
import { MenuService } from './menu.service';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { CategoryService } from '../category/category.service';
import randomPick from '../../../utils/randomPick';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @ApiBody({ type: MenuDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @UseInterceptors(FileInterceptor('file'))
  async post(@Body() dto: MenuDto, @UploadedFile() file) {
    await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
      store_uuid: dto.store_uuid,
    });

    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.menuService.save(saveDto);
    } else {
      return this.menuService.save(dto);
    }
  }

  @Post('owner')
  @ApiBody({ type: MenuOwnerDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @UseInterceptors(FileInterceptor('file'))
  postByOwner(@Req() req, @Body() dto: MenuOwnerDto, @UploadedFile() file) {
    const store = req.user.store;

    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
        store_uuid: store.uuid,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.menuService.save(saveDto);
    } else {
      const saveDto = Object.assign(dto, {
        store_uuid: store.uuid,
      });
      return this.menuService.save(saveDto);
    }
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
  @UseInterceptors(FileInterceptor('file'))
  async putOne(
    @Param('uuid') uuid: string,
    @Body() dto: MenuUpdateDto,
    @UploadedFile() file,
  ) {
    const category = await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
    });
    await this.menuService.findOneOrFail({
      uuid: uuid,
      category_uuid: dto.category_uuid,
      store_uuid: category.store_uuid,
    });

    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      await this.menuService.findOneOrFail({ uuid: uuid });
      return this.menuService.update({ uuid: uuid }, saveDto);
    } else {
      await this.menuService.findOneOrFail({ uuid: uuid });
      return this.menuService.update({ uuid: uuid }, dto);
    }
  }

  @Put('owner/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  @UseInterceptors(FileInterceptor('file'))
  async putOneByOwner(
    @Req() req,
    @Param('uuid') uuid: string,
    @Body() dto: MenuOwnerDto,
    @UploadedFile() file,
  ) {
    const store = req.user.store;
    await this.menuService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });
    await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
      store_uuid: store.uuid,
    });

    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.menuService.update({ uuid: uuid }, saveDto);
    } else {
      return this.menuService.update({ uuid: uuid }, dto);
    }
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Param('uuid') uuid: string) {
    await this.menuService.findOneOrFail({ uuid: uuid });
    return this.menuService.delete({ uuid: uuid });
  }

  @Delete('owner/:uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  async deleteOneByOwner(@Req() req, @Param('uuid') uuid: string) {
    const store = req.user.store;
    await this.menuService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });

    return this.menuService.delete({ uuid: uuid });
  }
}
