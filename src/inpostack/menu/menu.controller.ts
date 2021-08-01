import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { MenuCreateDto, MenuUpdateDto } from "./menuCreateDto";
import { MenuService } from "./menu.service";
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';

@ApiTags("Menu")
@Controller("menu")
export class MenuController {
  constructor(
    private readonly menuService: MenuService
  ) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: MenuCreateDto })
  post(@Body() dto: MenuCreateDto, @UploadedFile() file) {
    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`
      const saveDto = Object.assign(dto, {
        image_url: stored_path
      })
      fs.writeFile(stored_path, file.buffer, () => {});
      return this.menuService.save(saveDto);
    } else {
      return this.menuService.save(dto);
    }
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
  @UseInterceptors(FileInterceptor('file'))
  async putOne(@Param("uuid") uuid: string, @Body() dto: MenuUpdateDto, @UploadedFile() file) {
    if (file) {
      const stored_path = `uploads/menu/${file.originalname}`
      const saveDto = Object.assign(dto, {
        image_url: stored_path
      })
      fs.writeFile(stored_path, file.buffer, () => {});
      await this.menuService.findOneOrFail({ uuid: uuid });
      return this.menuService.update({ uuid: uuid }, saveDto);
    } else {
      await this.menuService.findOneOrFail({ uuid: uuid });
      return this.menuService.update({ uuid: uuid }, dto);
    }

  }

  @Delete(":uuid")
  async deleteOne(@Param("uuid") uuid: string) {
    await this.menuService.findOneOrFail({ uuid: uuid });
    return this.menuService.delete({ uuid: uuid });
  }

}
