import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { InpostackModule } from './inpostack/inpostack.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    InpostackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
