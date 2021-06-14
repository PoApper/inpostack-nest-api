import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreDto } from "./store.dto";
import { ApiTags, ApiBody } from "@nestjs/swagger";

@ApiTags("Store")
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {
  }

  @Post()
  @ApiBody({ type: StoreDto })
  post(@Body() dto: StoreDto) {
    return this.storeService.save(dto);
  }

  @Get()
  get() {
    return this.storeService.find({ order: { created_at: "DESC" } });
  }

  @Get(":uuid")
  getOne(@Param("uuid") uuid: string) {
    return this.storeService.findOne({ uuid: uuid });
  }

  @Put(":uuid")
  put(@Param("uuid") uuid: string, @Body() dto: StoreDto) {
    return this.storeService.update({ uuid: uuid }, dto);
  }

  @Delete(":uuid")
  delete(@Param("uuid") uuid: string) {
    return this.storeService.delete({ uuid: uuid });
  }
}
