import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { AccountModule } from '../inpostack/account/account.module';
import { StoreModule } from '../inpostack/market/store/store.module';

@Module({
  imports: [AccountModule, StoreModule],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
