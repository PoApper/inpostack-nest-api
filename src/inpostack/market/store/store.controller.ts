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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreType } from './store.meta';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';
import { JwtGuard } from '../../../auth/guard/jwt.guard';
import { AllowAnonymous } from '../../../auth/decorator/anonymous.decorator';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiBody({ type: StoreDto })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @UseInterceptors(FileInterceptor('file'))
  post(@Body() dto: StoreDto, @UploadedFile() file) {
    if (file) {
      const stored_path = `uploads/store/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.storeService.save(saveDto);
    } else {
      return this.storeService.save(dto);
    }
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

    this.storeService.saveEvent(req.user ?? 'Non-login User', uuid);

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
  @UseInterceptors(FileInterceptor('file'))
  updateOwnStore(@Req() req, @Body() dto: StoreDto, @UploadedFile() file) {
    const store = req.user.store;

    if (file) {
      const stored_path = `uploads/store/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.storeService.update({ uuid: store.uuid }, saveDto);
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
  @UseInterceptors(FileInterceptor('file'))
  updateOne(
    @Param('uuid') uuid: string,
    @Body() dto: StoreDto,
    @UploadedFile() file,
  ) {
    if (file) {
      const stored_path = `uploads/store/${file.originalname}`;
      const saveDto = Object.assign(dto, {
        image_url: stored_path,
      });
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.storeService.update({ uuid: uuid }, saveDto);
    } else {
      return this.storeService.update({ uuid: uuid }, dto);
    }
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  deleteOne(@Param('uuid') uuid: string) {
    return this.storeService.delete({ uuid: uuid });
  }
}
