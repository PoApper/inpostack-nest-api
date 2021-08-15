import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { MenuCreateDto, MenuUpdateDto } from './menuCreateDto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    private readonly categoryService: CategoryService,
  ) {}

  async save(dto: MenuCreateDto) {
    const category = await this.categoryService.findOneOrFail({
      uuid: dto.category_uuid,
    });

    return this.menuRepo.save({
      name: dto.name,
      price: dto.price,
      description: dto.description,
      like: dto.like,
      hate: dto.hate,
      category: category,
    });
  }

  findAll(findOptions?: object) {
    return this.menuRepo.find(findOptions);
  }

  findOne(findOptions: object, maybeOptions?: object) {
    return this.menuRepo.findOne(findOptions, maybeOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.menuRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: MenuUpdateDto) {
    return this.menuRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.menuRepo.delete(findOptions);
  }
}
