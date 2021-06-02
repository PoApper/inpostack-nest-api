import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import { Account } from "./account.entity";
import { AccountCreateDto, AccountUpdateDto } from "./account.dto";
import encryptPassword from "../../utils/encryptPassword";


const Message = {
  NOT_EXISTING_USER: "There's no such user."
};

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>
  ) {
  }

  async save(dto: AccountCreateDto) {
    // encrypt password
    const cryptoSalt = crypto.randomBytes(64).toString("base64");
    const encryptedPassword = encryptPassword(dto.password, cryptoSalt);

    const saveDto = Object.assign(
      dto,
      { last_login_at: new Date(), password: encryptedPassword, crypto_salt: cryptoSalt }
    );
    return this.accountRepo.save(saveDto);
  }

  find(findOptions?: object) {
    return this.accountRepo.find(findOptions);
  }

  count(findOptions?: object) {
    return this.accountRepo.count(findOptions);
  }

  findOne(findOptions: object) {
    return this.accountRepo.findOne(findOptions);
  }

  findOneOrFail(findOptions: object) {
    return this.accountRepo.findOneOrFail(findOptions);
  }

  update(findOptions: object, dto: AccountUpdateDto) {
    return this.accountRepo.update(findOptions, dto);
  }

  async updateLoginById(id: string) {
    const existUser = await this.findOne({ id: id });
    if (!existUser) {
      throw new BadRequestException(Message.NOT_EXISTING_USER);
    } else {
      this.accountRepo.update({ uuid: existUser.uuid, email: existUser.email, id: existUser.id }, {
        last_login_at: new Date()
      });
    }
  }

  delete(findOptions: object) {
    return this.accountRepo.delete(findOptions);
  }


}
