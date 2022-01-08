import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { MarketSearchController } from './market-search.controller';

@Module({
  imports: [StoreModule, CategoryModule, MenuModule, ReviewModule],
  controllers: [MarketSearchController],
  exports: [StoreModule, ReviewModule],
})
export class MarketModule {}
