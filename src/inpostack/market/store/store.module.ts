import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AccountModule } from '../../account/account.module';
import { FileModule } from '../../../file/file.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entity/store.entity';
import { StoreVisitEvent } from '../../../event/store-visit-event.entity';
import { StoreFavorite } from './entity/store-favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, StoreVisitEvent, StoreFavorite]),
    NestjsFormDataModule,
    FileModule,
    AccountModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
