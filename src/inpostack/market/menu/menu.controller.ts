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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MenuDto, MenuOwnerDto, MenuUpdateDto } from './menu.dto';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { CategoryService } from '../category/category.service';

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
