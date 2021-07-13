import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreDto } from "./store.dto";
import { ApiTags, ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
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
  @ApiQuery({ name: "category", required: false })
  @ApiQuery({ name: "menu", required: false })
  getAll(
    @Query("category") category: boolean,
    @Query("menu") menu: boolean
  ) {
    const relation_query = [];
    if (category) relation_query.push("category");
    if (category && menu) relation_query.push("category.menu");

    return this.storeService.find({
      order: { created_at: "DESC" },
      relations: relation_query
    });
  }

  @Get("meta")
  @ApiOperation({ summary: "get store meta API", description: "get store meta data" })
  getMeta() {
    return {
      "store_type": StoreType
    };
  }

  @Get(":uuid")
  @ApiQuery({ name: "category", required: false })
  @ApiQuery({ name: "menu", required: false })
  getOne(
    @Param("uuid") uuid: string,
    @Query("category") category: boolean,
    @Query("menu") menu: boolean
  ) {
    const relation_query = [];
    if (category) relation_query.push("category");
    if (category && menu) relation_query.push("category.menu");

    return this.storeService.findOne(
      { uuid: uuid },
      { relations: relation_query }
    );
  }

  @Get("owner/:owner_uuid")
  getByOwner(@Param('owner_uuid') owner_uuid: string) {
    return this.storeService.findOneOrFail({ owner_uuid: owner_uuid });
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
