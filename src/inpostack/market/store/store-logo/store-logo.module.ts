import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileModule } from '../../../../file/file.module';
import { AuthModule } from '../../../../auth/auth.module';
import { Store } from '../store.entity';
import { StoreLogoService } from './store-logo.service';
import { StoreLogoController } from './store-logo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    NestjsFormDataModule,
    FileModule,
    AuthModule,
  ],
  providers: [StoreLogoService],
  controllers: [StoreLogoController],
  exports: [StoreLogoService],
})
export class StoreLogoModule {}
