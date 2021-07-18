import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountStatus, AccountType } from './account.meta';
import { AccountCreateDto } from './account.dto';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    LoggerModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {
  constructor (private readonly accountService: AccountService) {
    this.createDefaultAdmin().then(
      (adminDto) =>
        console.log(
          `Create Default Admin Account:
            - id: ${adminDto.id}
            - pw: ${adminDto.password}`,
        )).catch(
      (err) => console.error('Fail to create default Admin account...', err),
    );
  }

  async createDefaultAdmin (): Promise<AccountCreateDto> {
    const num: number = await this.accountService.count();
    if (num) return;
    // create default admin account
    const id = 'admin';
    const password = 'admin1234';
    const adminDto: AccountCreateDto = {
      email: 'none',
      name: 'defaultAdmin',
      id: id,
      password: password,
      account_type: AccountType.admin,
      account_status: AccountStatus.activated,
    };

    await this.accountService.save(adminDto);
    return adminDto;
  }
}
