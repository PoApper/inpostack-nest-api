import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryCreateDto, CategoryUpdateDto } from './categoryCreateDto';
import { StoreService } from '../store.service';
import { Store } from '../store.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly storeService: StoreService,
  ) {}

  async save(dto: CategoryCreateDto) {
    const store: Store = await this.storeService.findOneOrFail({
      uuid: dto.store_uuid,
    });

    return this.categoryRepo.save({
      name: dto.name,
      store: store,
    });
  }

  findAll(findOptions?: object) {
    return this.categoryRepo.find(findOptions);
  }

  findOne(findOptions: object, maybeOptions?: object) {
    return this.categoryRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.categoryRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: CategoryUpdateDto) {
    return this.categoryRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.categoryRepo.delete(findOptions);
  }
}
