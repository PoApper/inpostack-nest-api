import { Module } from '@nestjs/common';
import { StoreModule } from "./store/store.module";
import { AccountModule } from './account/account.module';
import { NoticeModule } from './notice/notice.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [StoreModule, AccountModule, NoticeModule, CategoryModule, MenuModule]
})
export class InpostackModule {}

