import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreDto } from "./store.dto";
import { ApiTags, ApiBody, ApiOperation } from "@nestjs/swagger";
import { StoreType } from "./store.meta";

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

  @Get("meta")
  @ApiOperation({ summary: "get store meta API", description: "get store meta data" })
  getMeta() {
    return {
      "store_type": StoreType
    };
  }

  @Get(":uuid")
  getOne(@Param("uuid") uuid: string) {
    return this.storeService.findOne({ uuid: uuid });
  }

  @Put(":uuid")
  putOne(@Param("uuid") uuid: string, @Body() dto: StoreDto) {
    return this.storeService.update({ uuid: uuid }, dto);
  }

  @Delete(":uuid")
  deleteOne(@Param("uuid") uuid: string) {
    return this.storeService.delete({ uuid: uuid });
  }
}
