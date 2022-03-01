import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { StoreModule } from '../store/store.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), StoreModule, AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
