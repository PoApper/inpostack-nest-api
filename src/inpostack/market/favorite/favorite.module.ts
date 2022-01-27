import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../auth/auth.module';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { MenuFavorite } from './entity/menu-favorite.entity';
import { StoreFavorite } from './entity/store-favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuFavorite, StoreFavorite]),
    AuthModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
