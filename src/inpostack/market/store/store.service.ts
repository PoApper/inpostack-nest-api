import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { getManager, Repository } from 'typeorm';
import { StoreDto } from './store.dto';
import { StoreVisitEvent } from '../../../event/store-visit-event.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(StoreVisitEvent)
    private readonly storeVisitEventRepo: Repository<StoreVisitEvent>,
  ) {}

  save(dto: StoreDto) {
    return this.storeRepo.save(dto);
  }

  find(findOptions?: object) {
    return this.storeRepo.find(findOptions);
  }

  count(findOptions?: object) {
    return this.storeRepo.count(findOptions);
  }

  findOne(findOptions: object, maybeOptions?: object) {
    return this.storeRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail(findOptions: object, maybeOptions?: object) {
    return this.storeRepo.findOneOrFail(findOptions, maybeOptions);
  }

  update(findOptions: object, dto: StoreDto | object) {
    return this.storeRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.storeRepo.delete(findOptions);
  }

  saveStoreVisitEvent(user_uuid: string, store_uuid: string) {
    return this.storeVisitEventRepo.save({
      user_uuid: user_uuid,
      store_uuid: store_uuid,
    });
  }

  async plusVisitCount(uuid: string) {
    const store: Store = await this.storeRepo.findOne(uuid);
    return this.storeRepo.update(uuid, { visit_count: store.visit_count + 1 });
  }

  getPopularTopNStores(dateBefore: string, timeNow: string, limit: number) {
    return getManager().query(`
      SELECT
        store_visit_event.store_uuid,
        store.name,
        store.image_url,
        COUNT(*) AS total_visit_count
      FROM
        store_visit_event
      LEFT JOIN
        store
        ON store.uuid = store_visit_event.store_uuid
      WHERE
        DATE(store_visit_event.visited_at) > '${dateBefore}'
        AND '${timeNow}' BETWEEN store.open_time AND store.close_time
      GROUP BY
        1, 2, 3
      ORDER BY
        4 DESC
      LIMIT ${limit}
    `);
  }
}
