import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Store } from "./store.entity";
import { Repository } from "typeorm";
import { StoreDto } from "./store.dto";
import * as fs from "fs";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>
  ) {
  }

  async save(dto: StoreDto) {
    const saveDto = Object.assign({}, dto);
    const newStore = await this.storeRepo.save(saveDto);

    const menuSavePath = `./static/store/menu/${newStore.uuid}.json`;

    fs.writeFile(menuSavePath, JSON.stringify(dto.menu), err => {
      if (err) {
        console.log(`Error writing ${dto.name} menu json`, err);
      } else {
        console.log(`Successfully wrote ${dto.name} menu json`);
      }
    });
    return newStore;
  }

  find(findOptions?: object) {
    return this.storeRepo.find(findOptions);
  }

  async findOne(findOptions: object) {
    const store = await this.storeRepo.findOne(findOptions);

    const readPath = `./static/store/menu/${store.uuid}.json`;
    const menuJson = fs.readFileSync(readPath, "utf8");
    const result = Object.assign({menu: JSON.parse(menuJson)}, store);

    return result;
  }

  async update(findOptions: object, dto: StoreDto) {
    const existStore = await this.findOne(findOptions);
    const {menu, ...updateDto} = dto;
    const out = await this.storeRepo.update(findOptions, updateDto);

    const menuSavePath = `./static/store/menu/${existStore.uuid}.json`;

    fs.writeFileSync(menuSavePath, JSON.stringify(menu));
    return out;
  }

  delete(findOptions: object) {
    return this.storeRepo.delete(findOptions);
  }
}
