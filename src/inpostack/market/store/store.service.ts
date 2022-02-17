import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
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
    // TODO: 저장하기 전에 distance 구해서 .save() 함수에 전달하는 Object에 함께 전달
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

  update(findOptions: object, dto: StoreDto) {
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
}
