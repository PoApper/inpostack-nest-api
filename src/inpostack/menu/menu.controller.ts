import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { MenuCreateDto, MenuUpdateDto } from "./menuCreateDto";
import { MenuService } from "./menu.service";

@ApiTags("Menu")
@Controller("menu")
export class MenuController {
  constructor(
    private readonly menuService: MenuService
  ) {
  }

  @Post()
  @ApiBody({ type: MenuCreateDto })
  post(@Body() dto: MenuCreateDto) {
    return this.menuService.save(dto);
  }

  @Get()
  getAll() {
    return this.menuService.findAll();
  }

  @Get(":uuid")
  getOne(@Param("uuid") uuid: string) {
    return this.menuService.findOne({ uuid: uuid });
  }

  @Put(":uuid")
  putOne(@Param("uuid") uuid: string, @Body() dto: MenuUpdateDto) {
    return this.menuService.update({ uuid: uuid }, dto);
  }

  @Delete(":uuid")
  deleteOne(@Param("uuid") uuid: string) {
    return this.menuService.delete({ uuid: uuid });
  }

}
