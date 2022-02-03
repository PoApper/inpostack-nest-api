import { Controller, Get, Query } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService
  ) {
  }

  @ApiOperation({ summary: 'Daily Register User' })
  @Get('daily_register_user')
  async dailyRegisterUser(
    @Query('start_date') startDate: Date,
    @Query('end_date') endDate: Date,
  ) {
    return this.statisticsService.dailyRegisterUserQuery(startDate, endDate);
  }

  @ApiOperation({ summary: 'Daily Active User' })
  @Get('daily_active_user')
  async dailyActiveUser(
    @Query('start_date') startDate: Date,
    @Query('end_date') endDate: Date,
  ) {
    return this.statisticsService.dailyActiveUserQuery(startDate, endDate);
  }

  @ApiOperation({ summary: 'Daily Store Visit' })
  @Get('daily_store_visit')
  async dailyTotalStoreVisitUser(
    @Query('start_date') startDate: Date,
    @Query('end_date') endDate: Date,
    @Query('store_uuid') storeUuid: string,
  ) {
    return this.statisticsService.dailyTotalStoreVisitUserQuery(startDate, endDate, storeUuid);
  }

  @ApiOperation({summary: 'Store Visit Time'})
  @Get('store_visit_time')
  async storeVisitTime(@Query('start_date') startDate: Date,
                       @Query('end_date') endDate: Date,
                       @Query('store_uuid') storeUuid: string
  ) {
    return this.statisticsService.storeVisitTimeQuery(startDate, endDate, storeUuid)
  }

  @ApiOperation({summary: 'Store Visit Time'})
  @Get('store_visit_time')
  async storeVisitTime(@Query('start_date') startDate: Date,
                       @Query('end_date') endDate: Date,
                       @Query('store_uuid') storeUuid: string
  ) {
    const startDateUtc = new Date(startDate);
    const endDateUtc = new Date(endDate);
    startDateUtc.setHours(startDateUtc.getHours()-9);
    endDateUtc.setHours(endDateUtc.getHours()-9);
    return (
      createQueryBuilder('store_visit_event')
        .select([
          `DATE_FORMAT(CONVERT_TZ(visited_at, '+00:00','+09:00'), '%h:%i') AS visit_hour`,
          `visited_at`,
          'COUNT(*) AS visit_count'
        ])
        .where(`visited_at BETWEEN '${startDateUtc.toISOString()}' AND '${endDateUtc.toISOString()}'`)
        .andWhere(`store_uuid = '${storeUuid}'`)
        .groupBy('visit_hour')
        .orderBy('visited_at')
        .getRawMany()
    );
  }
}
