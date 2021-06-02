import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./account.entity";
import { AccountType, AccountStatus } from "./account.meta";
import { AccountCreateDto } from "./account.dto";

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {
  constructor(private readonly accountService: AccountService) {
    this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    const num = await this.accountService.count();
    if (num) return;
    // create default admin account
    const adminDto: AccountCreateDto = {
      email: "none",
      name: "defaultAdmin",
      id: "admin",
      password: "admin1234",
      account_type: AccountType.admin,
      account_status: AccountStatus.activated
    };
    console.log(
      `Create Default Admin Account:
      - id: ${adminDto.id}
      - pw: ${adminDto.password}`
    );
    this.accountService.save(adminDto);
  }
}
