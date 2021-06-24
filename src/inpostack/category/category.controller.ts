import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryCreateDto, CategoryUpdateDto } from "./categoryCreateDto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

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
  get() {
    return this.categoryService.findAll();
  }

  @Get(":uuid")
  getOne(@Param("uuid") uuid: string) {
    return this.categoryService.findOne({ uuid: uuid });
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
