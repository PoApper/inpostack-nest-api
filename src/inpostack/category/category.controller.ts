import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryCreateDto, CategoryUpdateDto } from "./categoryCreateDto";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {
  }

  @Post()
  @ApiBody({ type: CategoryCreateDto })
  post(@Body() dto: CategoryCreateDto) {
    return this.categoryService.save(dto);
  }

  @Get()
  @ApiQuery({ name: "menu", required: false })
  getAll(
    @Query("menu") menu: boolean
  ) {
    const relation_query = [];
    if (menu) relation_query.push("menu");

    return this.categoryService.findAll(
      { relations: relation_query }
    );
  }

  @Get(":uuid")
  @ApiQuery({ name: "menu", required: false })
  getOne(
    @Param("uuid") uuid: string,
    @Query("menu") menu: boolean
  ) {
    const relation_query = [];
    if (menu) relation_query.push("menu");

    return this.categoryService.findOne(
      { uuid: uuid },
      { relations: relation_query }
    );
  }

  @Put(":uuid")
  async putOne(@Param("uuid") uuid: string, @Body() dto: CategoryUpdateDto) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.update({ uuid: uuid }, dto);
  }

  @Delete(":uuid")
  async deleteOne(@Param("uuid") uuid: string) {
    await this.categoryService.findOneOrFail({ uuid: uuid });
    return this.categoryService.delete({ uuid: uuid });
  }

}
