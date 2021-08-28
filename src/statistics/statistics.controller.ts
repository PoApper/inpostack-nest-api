import { Controller, Get, Query } from "@nestjs/common";
import { createQueryBuilder } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Statistics")
@Controller("statistics")
export class StatisticsController {
  @ApiOperation({ summary: "Daily Register User" })
  @Get("DRU")
  async dailyRegisterUser(
    @Query("start_date") start_date: Date,
    @Query("end_date") end_date: Date
    ) {
    return createQueryBuilder("account")
      .select("created_at")
      .addSelect("COUNT(uuid) AS DRU")
      .where(`created_at BETWEEN '${start_date}' AND '${end_date}'`)
      .orderBy("created_at")
      .getRawMany();
  }

  @ApiOperation({ summary: "Daily Active User" })
  @Get("DAU")
  async dailyActiveUser(
    @Query("start_date") start_date: Date,
    @Query("end_date") end_date: Date
  ) {
    return createQueryBuilder("account")
      .select("DATE(last_login_at) AS login_at")
      .addSelect("COUNT(uuid) AS DAU")
      .where(`last_login_at BETWEEN '${start_date}' AND '${end_date}'`)
      .orderBy("login_at")
      .getRawMany();
  }

  @ApiOperation({ summary: "Daily store Visit User" })
  @Get("DVU")
  async dailyStoreVisitUser(
    @Query("start_date") start_date: Date,
    @Query("end_date") end_date: Date
  ) {
    return createQueryBuilder("store_visit")
      .select("visited_at")
      .addSelect("COUNT(uuid) AS DVU")
      .where(`visited_at BETWEEN '${start_date}' AND '${end_date}'`)
      .orderBy("visited_at")
      .getRawMany();
  }
}
