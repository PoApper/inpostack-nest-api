import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Account } from "./account.entity";
import { AccountCreateDto, AccountUpdateDto } from "./account.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>
  ) {
  }

  async save(dto: AccountCreateDto) {
    const saveDto = Object.assign({lastLoginAt: new Date()}, dto);
    return this.accountRepo.save(saveDto);
  }

  find(findOptions?: object) {
    return this.accountRepo.find(findOptions);
  }

  findOne(findOptions: object) {
    return this.accountRepo.findOne(findOptions);
  }

  update(findOptions: object, dto: AccountUpdateDto) {
    return this.accountRepo.update(findOptions, dto);
  }

  delete(findOptions: object) {
    return this.accountRepo.delete(findOptions);
  }


}
