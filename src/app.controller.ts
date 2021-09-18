import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccountTypeGuard } from './auth/guard/role.guard';
import { AccountTypes } from './auth/decorator/role.decorator';
import { AccountType } from './inpostack/account/account.meta';
import { StoreGuard } from './auth/guard/store.guard';
import { JwtGuard } from './auth/guard/jwt.guard';
import { AllowAnonymous } from './auth/decorator/anonymous.decorator';
import * as fs from 'fs';
import { StoreType } from './inpostack/market/store/store.meta';
import { CsvParser } from 'nest-csv-parser';
import { StoreService } from './inpostack/market/store/store.service';
import { CategoryService } from './inpostack/market/category/category.service';
import { MenuService } from './inpostack/market/menu/menu.service';
import { LoremIpsum } from 'lorem-ipsum';
import { Public } from 'nest-keycloak-connect';

class StoreDummy {
  name: string;
  store_type: StoreType;
}

class CategoryMenuDummy {
  store_name: string;
  category_name: string;
  menu_name: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storeService: StoreService,
    private readonly categoryService: CategoryService,
    private readonly menuService: MenuService,
    private readonly csvParser: CsvParser,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('anonymous_auth')
  @UseGuards(JwtGuard)
  @AllowAnonymous()
  testAnonymousAuth(@Req() req) {
    return req.user ?? 'Non-login User';
  }

  @Get('private_auth')
  @UseGuards(JwtGuard)
  testPrivateAuth(@Req() req) {
    return req.user;
  }

  @Get('role_auth')
  @UseGuards(JwtGuard, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  testRoleAuth(@Req() req) {
    return req.user;
  }

  @Get('owner_auth')
  @UseGuards(JwtGuard, AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  testStoreAuth(@Req() req) {
    return req.user;
  }

  @Get('default_store_set_up')
  @Public()
  async defaultStoreSetUp() {
    console.log(__dirname);
    const stream = fs.createReadStream('./default_stores.csv');
    const result = await this.csvParser.parse(stream, StoreDummy, null, null, {
      strict: true,
      separator: ',',
    });
    const storeDummies: StoreDummy[] = result['list'];

    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });

    for (const store_dummy of storeDummies) {
      this.storeService.save({
        name: store_dummy.name,
        phone: '010-0000-0000',
        description: lorem.generateSentences(4),
        store_type: store_dummy.store_type,
        address1: '경상북도 포항시 남구 청암로 77(지곡동)',
        address2: '기숙사 1동 101호',
        zipcode: 0,
        open_time: '09:00',
        close_time: '21:00',
      });
    }

    return storeDummies;
  }

  @Get('default_category_menu_set_up')
  @Public()
  async defaultCategoryMenuSetUp() {
    const stream = fs.createReadStream('./default_category_and_menu.csv');
    const result = await this.csvParser.parse(
      stream,
      CategoryMenuDummy,
      null,
      null,
      { strict: true, separator: ',' },
    );
    const categoryMenuDummies: CategoryMenuDummy[] = result['list'];

    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });

    for (const categoryMenuDummy of categoryMenuDummies) {
      const store = await this.storeService.findOne({
        name: categoryMenuDummy.store_name,
      });

      if (!store) {
        console.log(categoryMenuDummy);
        continue;
      }

      let category = await this.categoryService.findOne({
        name: categoryMenuDummy.category_name,
      });

      if (!category) {
        // create new category
        category = await this.categoryService.save({
          name: categoryMenuDummy.category_name,
          description: lorem.generateSentences(1),
          store_uuid: store.uuid,
        });
      }

      this.menuService.save({
        category_uuid: category.uuid,
        store_uuid: store.uuid,
        name: categoryMenuDummy.menu_name,
        price: (Math.floor(Math.random() * 100) + 1) * 1000,
        like: Math.floor(Math.random() * 100),
        hate: Math.floor(Math.random() * 100),
        description: lorem.generateSentences(3),
        is_main_menu: true,
      });
    }
    return categoryMenuDummies;
  }
}
