import { Module } from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { Store } from "./store.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService]
})
export class StoreModule {}
