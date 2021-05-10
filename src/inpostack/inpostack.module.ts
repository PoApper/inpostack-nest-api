import { Module } from '@nestjs/common';
import { StoreModule } from "./store/store.module";
import { AccountModule } from './account/account.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [StoreModule, AccountModule, NoticeModule]
})
export class InpostackModule {}

