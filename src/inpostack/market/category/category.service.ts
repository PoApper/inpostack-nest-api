import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto, CategoryUpdateDto } from './category.dto';
import { StoreService } from '../store/store.service';
import { Store } from '../store/store.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly storeService: StoreService,
  ) {}

  async save(dto: CategoryDto) {
    const store: Store = await this.storeService.findOneOrFail({
      uuid: dto.store_uuid,
    });

    return this.categoryRepo.save({
      name: dto.name,
      store: store,
      description: dto.description,
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
