import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [StoreModule, CategoryModule, MenuModule, ReviewModule],
  exports: [StoreModule, ReviewModule],
})
export class MarketModule {}
