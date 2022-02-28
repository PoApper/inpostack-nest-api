import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreImage } from './store-image.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileModule } from '../../../../file/file.module';
import { AuthModule } from '../../../../auth/auth.module';
import { StoreImageService } from './store-image.service';
import { StoreImageController } from './store-image.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreImage]),
    NestjsFormDataModule,
    FileModule,
    AuthModule,
  ],
  providers: [StoreImageService],
  controllers: [StoreImageController],
  exports: [StoreImageService],
})
export class StoreImageModule {}
