import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { MenuFavorite } from './entity/menu-favorite.entity';
import { StoreFavorite } from './entity/store-favorite.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuFavorite, StoreFavorite]),
    AuthModule,
    forwardRef(() => StoreModule),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
