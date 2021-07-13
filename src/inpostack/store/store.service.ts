import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { StoreDto } from './store.dto';

@Injectable()
export class StoreService {
  constructor (
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {
  }

  save (dto: StoreDto) {
    return this.storeRepo.save(dto);
  }

  find (findOptions?: object) {
    return this.storeRepo.find(findOptions);
  }

  findOne (findOptions: object, maybeOptions?: object) {
    return this.storeRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail (findOptions: object, maybeOptions?: object) {
    return this.storeRepo.findOneOrFail(findOptions, maybeOptions);
  }

  update (findOptions: object, dto: StoreDto) {
    return this.storeRepo.update(findOptions, dto);
  }

  delete (findOptions: object) {
    return this.storeRepo.delete(findOptions);
  }
}
