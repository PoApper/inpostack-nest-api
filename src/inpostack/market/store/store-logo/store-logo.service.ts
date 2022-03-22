import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../store.entity';
import { FileService } from '../../../../file/file.service';

@Injectable()
export class StoreLogoService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    private readonly fileService: FileService,
  ) {}

  findOneById(store_id: string) {
    return this.storeRepo.findOne(store_id);
  }

  updateStoreLogoById(store_id: string, logoDto: object) {
    return this.storeRepo.update(store_id, logoDto);
  }

  async deleteStoreLogoById(store_id: string) {
    const store = await this.storeRepo.findOne(store_id);
    if (!store) throw new BadRequestException('No store');

    if (store.image_url) {
      const deleteKey = `store/logo/${store_id}`;
      await this.fileService.deleteFile(deleteKey);

      store.image_url = null;
      await this.storeRepo.update(store_id, store);
    }
    return store;
  }
}
