import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Menu } from './entity/menu.entity';
import { CategoryModule } from '../category/category.module';
import { StoreModule } from '../store/store.module';
import { FileModule } from '../../../file/file.module';
import { AuthModule } from '../../../auth/auth.module';
import { MenuFavorite } from './entity/menu-favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuFavorite]),
    AuthModule,
    CategoryModule,
    StoreModule,
    FileModule,
    NestjsFormDataModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
