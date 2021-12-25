import { Controller, Get, Query } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  @ApiOperation({ summary: 'Daily Register User' })
  @Get('daily_register_user')
  async dailyRegisterUser(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return createQueryBuilder('account')
      .select(`DATE(created_at) AS register_date`)
      .addSelect('COUNT(*) AS daily_register_user')
      .where(`login_at BETWEEN '${start_date}' AND '${end_date}'`)
      .groupBy('register_date')
      .orderBy('register_date')
      .getRawMany();
  }

  @ApiOperation({ summary: 'Daily Active User' })
  @Get('daily_active_user')
  async dailyActiveUser(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return createQueryBuilder('user_login_event')
      .select('DATE(login_at) AS login_date')
      .addSelect('COUNT(DISTINCT user_uuid) AS daily_active_user')
      .where(`login_at BETWEEN '${start_date}' AND '${end_date}'`)
      .groupBy('login_date')
      .orderBy('login_date')
      .getRawMany();
  }

  @ApiOperation({ summary: 'Daily Store Visit' })
  @Get('daily_store_visit')
  async dailyStoreVisitUserTotal(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
    @Query('store_uuid') store_uuid: string,
  ) {
    console.log(store_uuid);
    return (
      createQueryBuilder('store_visit_event')
        .select(`DATE(visited_at) AS visit_date`)
        .addSelect('COUNT(*) AS daily_store_visit')
        .where(`visited_at BETWEEN '${start_date}' AND '${end_date}'`)
        // .andWhere(store_uuid ? `store_uuid = ${store_uuid}` : 'TRUE')
        .groupBy('visit_date')
        .orderBy('visit_date')
        .getRawMany()
    );
  }
}
