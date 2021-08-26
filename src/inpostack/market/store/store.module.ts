import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../../account/account.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreVisit } from '../../../event/store_visit_event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreVisit]), AccountModule],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
