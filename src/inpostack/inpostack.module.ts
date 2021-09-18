import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { MarketModule } from './market/market.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [AccountModule, MarketModule, NoticeModule],
})
export class InpostackModule {
  constructor() {}
}
