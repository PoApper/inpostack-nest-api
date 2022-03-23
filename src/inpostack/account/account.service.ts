import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import {
  AccountCreateDto,
  AccountRegisterDto,
  AccountUpdateDto,
} from './account.dto';
import { AccountStatus } from './account.meta';

const Message = {
  NOT_EXISTING_USER: "There's no such user.",
};

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async save(dto: AccountCreateDto | AccountRegisterDto) {
    // encrypt password

    const saveDto = Object.assign({}, dto, {
      last_login_at: new Date(),
      account_status: AccountStatus.activated,
    });
    return this.accountRepo.save(saveDto);
  }

  find(findOptions?: object) {
    return this.accountRepo.find(findOptions);
  }

  count(findOptions?: object) {
    return this.accountRepo.count(findOptions);
  }

  findOne(findOptions: object): Promise<Account> {
    return this.accountRepo.findOne(findOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.accountRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: AccountUpdateDto | object) {
    return this.accountRepo.update(findOptions, dto);
  }

  async updateLoginById(uuid: string) {
    const existUser = await this.findOne({ uuid: uuid });
    if (!existUser) {
      throw new BadRequestException(Message.NOT_EXISTING_USER);
    } else {
      this.accountRepo.update(
        { uuid: uuid },
        {
          last_login_at: new Date(),
        },
      );
    }
  }

  delete(findOptions: object) {
    return this.accountRepo.delete(findOptions);
  }
}
