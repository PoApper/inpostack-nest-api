import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CategoryUpdateDto } from './category.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountTypeGuard } from '../../../auth/guard/role.guard';
import { AccountTypes } from '../../../auth/decorator/role.decorator';
import { AccountType } from '../../account/account.meta';
import { InPoStackAuth } from '../../../auth/guard/InPoStackAuth.guard';

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
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  post(@Body() dto: CategoryDto) {
    return this.categoryService.save(dto);
  }

  @Get()
  @ApiQuery({ name: 'menu', required: false })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  getAll(@Query('menu') menu: boolean) {
    const relation_query = [];
    if (menu) relation_query.push('menu');

    return this.categoryService.findAll({ relations: relation_query });
  }

  @Get(':uuid')
  @ApiQuery({ name: 'menu', required: false })
  getOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('menu') menu: boolean,
  ) {
    const relation_query = [];
    if (menu) relation_query.push('menu');

    return this.categoryService.findOne(
      { uuid: uuid },
      { relations: relation_query },
    );
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update category API',
    description: '(only for admin) update category',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async putOne(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: CategoryUpdateDto,
  ) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.update({ uuid: uuid }, dto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'delete category API',
    description: '(only for admin) delete category',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  async deleteOne(@Req() req, @Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.delete({ uuid: uuid });
  }
}
