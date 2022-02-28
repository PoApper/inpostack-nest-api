import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreImage } from './store-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreImageService {
  constructor(
    @InjectRepository(StoreImage)
    private readonly storeImageRepo: Repository<StoreImage>,
  ) {}

  save(store_id: string) {
    return this.storeImageRepo.save({ store_id: store_id });
  }

  findAllStoreImages(store_id: string) {
    return this.storeImageRepo.find({ store_id: store_id });
  }

  deleteStoreImage(store_image_id: string) {
    return this.storeImageRepo.delete(store_image_id);
  }
}
