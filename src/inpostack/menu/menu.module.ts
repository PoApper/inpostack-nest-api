import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "./menu.entity";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    CategoryModule
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {
}
