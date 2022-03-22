import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../../account/account.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreVisitEvent } from '../../../event/store-visit-event.entity';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuthModule } from '../../../auth/auth.module';
import { StoreImageModule } from './store-image/store-image.module';
import { StoreLogoModule } from './store-logo/store-logo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, StoreVisitEvent]),
    AccountModule,
    AuthModule,
    StoreImageModule,
    StoreLogoModule,
    forwardRef(() => FavoriteModule),
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
