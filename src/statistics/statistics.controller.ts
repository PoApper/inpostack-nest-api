import { Controller, Get, Query } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  @ApiOperation({ summary: 'Daily Register User' })
  @Get('DRU')
  async dailyRegisterUser(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return (
      createQueryBuilder('account')
        .select('COUNT(*) AS DRU')
        .addSelect('strftime("%Y-%m-%d", created_at) AS register_date') // sqlite
        // .addSelect(`DATE_FORMAT(created_at, '%Y-%m-%d') AS register_date`) // mysql
        .where(
          `created_at BETWEEN '${new Date(
            start_date ?? 0,
          ).toISOString()}' AND '${new Date(
            end_date ?? Date.now(),
          ).toISOString()}}'`,
        )
        .groupBy('register_date')
        .orderBy('register_date')
        .getRawMany()
    );
  }

  @ApiOperation({ summary: 'Daily Active User' })
  @Get('DAU')
  async dailyActiveUser(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    // TODO: Create User Login Event Table
    return 'Under Develop';
    return createQueryBuilder('account')
      .select('DATE(last_login_at) AS login_at')
      .addSelect('COUNT(uuid) AS DAU')
      .where(`last_login_at BETWEEN '${start_date}' AND '${end_date}'`)
      .orderBy('login_at')
      .getRawMany();
  }

  @ApiOperation({ summary: 'Total Daily Store Visit' })
  @Get('TDSV')
  async dailyStoreVisitUserTotal(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return (
      createQueryBuilder('store_visit')
        .select('COUNT(*) AS TDSV')
        .addSelect('strftime("%Y-%m-%d", visited_at) AS visit_date') // sqlite
        // .addSelect(`DATE_FORMAT(visited_at, '%Y-%m-%d') AS visit_date`) // mysql
        .where(
          `visited_at BETWEEN '${new Date(
            start_date ?? 0,
          ).toISOString()}' AND '${new Date(
            end_date ?? Date.now(),
          ).toISOString()}}'`,
        )
        .groupBy('visit_date')
        .orderBy('visit_date')
        .getRawMany()
    );
  }

  @ApiOperation({ summary: 'Daily Store Visit' })
  @Get('DSV')
  async dailyStoreVisitUser(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return (
      createQueryBuilder('store_visit')
        .select('COUNT(*) AS DSV')
        .addSelect('store_uuid')
        .addSelect('strftime("%Y-%m-%d", visited_at) AS visit_date') // sqlite
        // .addSelect(`DATE_FORMAT(visited_at, '%Y-%m-%d') AS visit_date`) // mysql
        .where(
          `visited_at BETWEEN '${new Date(
            start_date ?? 0,
          ).toISOString()}' AND '${new Date(
            end_date ?? Date.now(),
          ).toISOString()}}'`,
        )
        .groupBy('visit_date')
        .addGroupBy('store_uuid')
        .orderBy('visit_date')
        .addOrderBy('store_uuid')
        .getRawMany()
    );
  }
}
