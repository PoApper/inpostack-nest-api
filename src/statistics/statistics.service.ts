import { Injectable } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor() {
  }

  dailyRegisterUserQuery(startDate: Date, endDate: Date) {
    return createQueryBuilder('account')
      .select(`DATE(created_at) AS register_date`)
      .addSelect('COUNT(*) AS daily_register_user')
      .where(`created_at BETWEEN '${startDate}' AND '${endDate}'`)
      .groupBy('register_date')
      .orderBy('register_date')
      .getRawMany();
  }

  dailyActiveUserQuery(startDate: Date, endDate: Date) {
    return createQueryBuilder('user_login_event')
      .select('DATE(login_at) AS login_date')
      .addSelect('COUNT(DISTINCT user_uuid) AS daily_active_user')
      .where(`login_at BETWEEN '${startDate}' AND '${endDate}'`)
      .groupBy('login_date')
      .orderBy('login_date')
      .getRawMany();
  }

  dailyTotalStoreVisitUserQuery(startDate: Date, endDate: Date, storeUuid?: string) {
    return (
      createQueryBuilder('store_visit_event')
        .select(`DATE(visited_at) AS visit_date`)
        .addSelect('COUNT(*) AS daily_store_visit')
        .where(`visited_at BETWEEN '${startDate}' AND '${endDate}'`)
        // .andWhere(store_uuid ? `store_uuid = ${storeUuid}` : 'TRUE')
        .groupBy('visit_date')
        .orderBy('visit_date')
        .getRawMany()
    );
  }

  storeVisitTimeQuery(startDate: Date, endDate: Date, storeUuid: string) {
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
