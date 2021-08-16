import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { MenuDto, MenuUpdateDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async save(dto: MenuDto) {
    return this.menuRepo.save(dto);
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
