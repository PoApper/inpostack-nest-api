import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../../account/account.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    AccountModule,
    CategoryModule,
    MenuModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
