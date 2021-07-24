import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { AccountModule } from './account/account.module';
import { NoticeModule } from './notice/notice.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { StoreService } from './store/store.service';
import { AccountService } from './account/account.service';
import { StoreDto } from './store/store.dto';
import { StoreType } from './store/store.meta';
import { AccountCreateDto } from './account/account.dto';
import { AccountStatus, AccountType } from './account/account.meta';
import { Account } from './account/account.entity';
import { Store } from './store/store.entity';

@Module({
  imports: [
    StoreModule,
    AccountModule,
    NoticeModule,
    CategoryModule,
    MenuModule,
  ],
})
export class InpostackModule {
  constructor(
    private readonly accountService: AccountService,
    private readonly storeService: StoreService,
  ) {
    this.defaultSetup();
  }

  async defaultSetup() {
    const admin_id = 'admin',
      admin_pw = 'admin1234';
    await this.createDefaultAccount(admin_id, admin_pw, AccountType.admin);
    console.log(`Default Admin Account: {id: ${admin_id}, pw: ${admin_pw}}`);

    const owner_id = 'owner',
      owner_pw = 'owner1234';
    const defaultOwner: Account = await this.createDefaultAccount(
      owner_id,
      owner_pw,
      AccountType.storeOwner,
    );
    console.log(`Default Owner Account: {id: ${owner_id}, pw: ${owner_pw}}`);
    const defaultStore: Store = await this.createDefaultStore(
      defaultOwner.uuid,
    );
    console.log(`Default Store: {name: ${defaultStore.name}}`);

    const user_id = 'user',
      user_pw = 'user1234';
    await this.createDefaultAccount(user_id, user_pw, AccountType.user);
    console.log(`Default User Account: {id: ${user_id}, pw: ${user_pw}}`);
  }

  async createDefaultAccount(
    id: string,
    password: string,
    account_type: AccountType,
  ): Promise<Account> {
    const num: number = await this.accountService.count({
      account_type: account_type,
    });
    if (num) return null;
    // create default admin account
    const adminDto: AccountCreateDto = {
      email: 'none',
      name: `default_${account_type}`,
      id: id,
      password: password,
      account_type: account_type,
      account_status: AccountStatus.activated,
    };

    return this.accountService.save(adminDto);
  }

  async createDefaultStore(owner_uuid: string): Promise<Store> {
    const num_store: number = await this.storeService.count();
    if (num_store) return null;

    // create default store account
    const storeDto: StoreDto = {
      name: 'default store',
      phone: '010-1234-5678',
      description: '개발 테스트용 가게 입니다.',
      store_type: StoreType.korean,
      address1: '경상북도 포항시 남구 청암로 77(지곡동)',
      address2: '기숙사 1동 101호',
      zipcode: 37673,
      open_time: '09:00',
      close_time: '18:00',
      owner_uuid: owner_uuid,
    };

    return this.storeService.save(storeDto);
  }
}
