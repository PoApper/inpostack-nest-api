import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Store } from "./store.entity";
import { Repository } from "typeorm";
import { StoreDto } from "./store.dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>
  ) {
  }

  async save(dto: StoreDto) {
    return await this.storeRepo.save(dto);
  }

  find(findOptions?: object) {
    return this.storeRepo.find(findOptions);
  }

  async findOne(findOptions: object, maybeOptions?: object) {
    return await this.storeRepo.findOne(findOptions, maybeOptions);
  }

  async findOneOrFail(findOptions: object) {
    return await this.storeRepo.findOneOrFail(findOptions);
  }

  async update(findOptions: object, dto: StoreDto) {
    return await this.storeRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.storeRepo.delete(findOptions);
  }
}
