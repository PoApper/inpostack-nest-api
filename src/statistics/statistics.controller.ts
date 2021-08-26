import { Controller, Get, Query } from "@nestjs/common";
import { AccountService } from "../inpostack/account/account.service";
import { createQueryBuilder } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Statistics")
@Controller("statistics")
export class StatisticsController {
  constructor(private readonly userService: AccountService) {
  }

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
      .groupBy("created_at")
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
      .select("DATE_FORMAT(last_login_at, %Y%m%d) AS login_at")
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
    return createQueryBuilder("storevisit")
      .select("visited_at")
      .addSelect("COUNT(uuid) AS DVU")
      .where(`visited_at BETWEEN '${start_date}' AND '${end_date}'`)
      .orderBy("visited_at")
      .getRawMany();
  }
}
