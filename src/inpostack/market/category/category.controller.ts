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
import { CategoryService } from './category.service';
import {
  CategoryDto,
  CategoryOwnerDto,
  CategoryUpdateDto,
} from './categoryDto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypeGuard } from '../../../auth/role/role.guard';
import { AccountTypes } from '../../../auth/role/role.decorator';
import { AccountType } from '../../account/account.meta';
import { StoreGuard } from '../../../auth/guard/store.guard';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({ type: CategoryDto })
  @ApiOperation({
    summary: 'create category API',
    description: '(only for admin) create a new category',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  post(@Body() dto: CategoryDto) {
    return this.categoryService.save(dto);
  }

  @Post('owner')
  @ApiBody({ type: CategoryOwnerDto })
  @ApiOperation({
    summary: 'create own category API',
    description: 'create a new category to own store using auth token',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  postOwnCategory(@Req() req, @Body() dto: CategoryOwnerDto) {
    const user = req.user;
    const store = user.store;
    const saveDto: CategoryDto = {
      store_uuid: store.uuid,
      name: dto.name,
    };
    return this.categoryService.save(saveDto);
  }

  @Get()
  @ApiQuery({ name: 'menu', required: false })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  getAll(@Query('menu') menu: boolean) {
    const relation_query = [];
    if (menu) relation_query.push('menu');

    return this.categoryService.findAll({ relations: relation_query });
  }

  @Get('owner')
  @ApiOperation({
    summary: 'get all own category API',
    description: 'get all categories belong to own store using auth token',
  })
  @ApiQuery({ name: 'menu', required: false })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  getAllByOwner(@Req() req, @Query('menu') menu: boolean) {
    const user = req.user;
    const store = user.store;

    const relation_query = [];
    if (menu) relation_query.push('menu');

    return this.categoryService.findAll({
      where: { store_uuid: store.uuid },
      relations: relation_query,
    });
  }

  @Get(':uuid')
  @ApiQuery({ name: 'menu', required: false })
  getOne(@Param('uuid') uuid: string, @Query('menu') menu: boolean) {
    const relation_query = [];
    if (menu) relation_query.push('menu');

    return this.categoryService.findOne(
      { uuid: uuid },
      { relations: relation_query },
    );
  }

  @Put('owner/:uuid')
  @ApiOperation({
    summary: 'update own category API',
    description: 'update own category using auth token',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  async putOneByOwner(
    @Req() req,
    @Param('uuid') uuid: string,
    @Body() dto: CategoryUpdateDto,
  ) {
    const user = req.user;
    const store = user.store;
    console.log(store);

    await this.categoryService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });
    return this.categoryService.update({ uuid: uuid }, dto);
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update category API',
    description: '(only for admin) update category',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async putOne(
    @Req() req,
    @Param('uuid') uuid: string,
    @Body() dto: CategoryUpdateDto,
  ) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.update({ uuid: uuid }, dto);
  }

  @Delete('owner/:uuid')
  @ApiOperation({
    summary: 'delete own category API',
    description: 'delete own category using auth token',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  async deleteOneByOwner(@Req() req, @Param('uuid') uuid: string) {
    const user = req.user;
    const store = user.store;
    await this.categoryService.findOneOrFail({
      uuid: uuid,
      store_uuid: store.uuid,
    });
    return this.categoryService.delete({ uuid: uuid });
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'delete category API',
    description: '(only for admin) delete category',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Req() req, @Param('uuid') uuid: string) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.delete({ uuid: uuid });
  }
}
