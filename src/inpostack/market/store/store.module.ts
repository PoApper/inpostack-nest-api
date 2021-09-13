import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AccountModule } from '../../account/account.module';
import { FileModule } from '../../../file/file.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreVisit } from '../../../event/store_visit_event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, StoreVisit]),
    NestjsFormDataModule,
    FileModule,
    AccountModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
