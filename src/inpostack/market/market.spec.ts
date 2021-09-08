import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store/store.controller';
import { CategoryController } from './category/category.controller';
import { Store } from './store/store.entity';
import { Category } from './category/category.entity';
import { Menu } from './menu/menu.entity';
import { Account } from '../account/account.entity';
import { Review } from './review/review.entity';
import { StoreVisit } from '../../event/store_visit_event.entity';
import { StoreService } from './store/store.service';
import { MenuController } from './menu/menu.controller';
import { CategoryService } from './category/category.service';
import { MenuService } from './menu/menu.service';
import {
  categoryValue1,
  categoryValue2,
  menuValue1,
  menuValue2,
  storeDto1,
  storeDto2,
} from '../../../test/test_values';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileModule } from '../../file/file.module';

describe('Market Controller', () => {
  let storeController: StoreController;
  let categoryController: CategoryController;
  let menuController: MenuController;

  let marketModule: TestingModule;

  beforeAll(async () => {
    marketModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Store, Category, Menu, Account, Review, StoreVisit],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Store, StoreVisit, Category, Menu]),
        NestjsFormDataModule,
        FileModule,
      ],
      controllers: [StoreController, CategoryController, MenuController],
      providers: [StoreService, CategoryService, MenuService],
    }).compile();

    storeController = marketModule.get<StoreController>(StoreController);
    categoryController = marketModule.get<CategoryController>(
      CategoryController,
    );
    menuController = marketModule.get<MenuController>(MenuController);
  });

  afterAll(() => {
    marketModule.close();
  });

  describe('get empty', () => {
    it('should return a empty err', async () => {
      expect(await storeController.getAll()).toEqual([]);
      expect(await categoryController.getAll(false)).toEqual([]);
      expect(await menuController.getAll()).toEqual([]);
    });
  });

  describe('save one store', () => {
    let saved_entity;
    it('should create a store entity', async () => {
      saved_entity = await storeController.post(storeDto1, '');
      const {
        name,
        phone,
        description,
        store_type,
        address1,
        address2,
        zipcode,
        open_time,
        close_time,
        created_at,
        updated_at,
        uuid,
      } = saved_entity;
      expect({
        name: name,
        phone: phone,
        description: description,
        store_type: store_type,
        address1: address1,
        address2: address2,
        zipcode: zipcode,
        owner_uuid: null,
        image_url: null,
        open_time: open_time,
        close_time: close_time,
        created_at: created_at,
        updated_at: updated_at,
        uuid: uuid,
      }).toEqual(storeDto1);
    });

    it('should get a store entity', async () => {
      const store = await storeController.getOne(
        {},
        saved_entity.uuid,
        false,
        false,
      );
      expect(store).toEqual(saved_entity);
    });
  });

  describe('update one store', () => {
    it('should update a store entity', async () => {
      const storeList = await storeController.getAll(false, false);
      const store = storeList[0];
      await storeController.updateOne(store.uuid, storeDto2, '');
      const updated_entity = await storeController.getOne(
        {},
        store.uuid,
        false,
        false,
      );
      const {
        name,
        phone,
        description,
        store_type,
        address1,
        address2,
        zipcode,
        open_time,
        close_time,
      } = updated_entity;
      expect({
        name: name,
        phone: phone,
        description: description,
        store_type: store_type,
        address1: address1,
        address2: address2,
        zipcode: zipcode,
        open_time: open_time,
        close_time: close_time,
      }).toEqual(storeDto2);
    });
  });

  describe('save one category', () => {
    let saved_entity;

    it('should save a category entity', async () => {
      const storeList = await storeController.getAll(false, false);
      const store = storeList[0];
      const categoryDto1 = Object.assign(
        { store_uuid: store.uuid },
        categoryValue1,
      );
      saved_entity = await categoryController.post(categoryDto1);
      const { name, store_uuid, description } = saved_entity;
      expect({
        name: name,
        store_uuid: store_uuid,
        description: description,
      }).toEqual(categoryDto1);
    });

    it('should get a category entity', async () => {
      const category = await categoryController.getOne(
        saved_entity.uuid,
        false,
      );
      expect(category).toEqual({
        uuid: saved_entity.uuid,
        name: saved_entity.name,
        description: saved_entity.description,
        store_uuid: saved_entity.store_uuid,
        created_at: saved_entity.created_at,
        updated_at: saved_entity.updated_at,
      });
    });
  });

  describe('update one category', () => {
    it('should update a category entity', async () => {
      const categoryList = await categoryController.getAll(false);
      const category = categoryList[0];
      await categoryController.putOne('', category.uuid, categoryValue2);
      const updated_entity = await categoryController.getOne(
        category.uuid,
        false,
      );
      const { name, store_uuid, description } = updated_entity;
      expect({
        name: name,
        store_uuid: store_uuid,
        description: description,
      }).toEqual(
        Object.assign({ store_uuid: category.store_uuid }, categoryValue2),
      );
    });
  });

  describe('save one menu', () => {
    let saved_entity;

    it('should save a menu entity', async () => {
      const categoryList = await categoryController.getAll(false);
      const category = categoryList[0];
      const menuDto1 = Object.assign(
        {
          category_uuid: category.uuid,
          store_uuid: category.store_uuid,
        },
        menuValue1,
      );
      saved_entity = await menuController.post(menuDto1, '');
      const {
        category_uuid,
        store_uuid,
        name,
        price,
        description,
        is_main_menu,
        like,
        hate,
        uuid,
        created_at,
        updated_at,
      } = saved_entity;
      expect({
        category_uuid: category_uuid,
        store_uuid: store_uuid,
        name: name,
        price: price,
        description: description,
        is_main_menu: is_main_menu,
        like: like,
        hate: hate,
        image_url: null,
        uuid: uuid,
        created_at: created_at,
        updated_at: updated_at,
      }).toEqual(menuDto1);
    });

    it('should get a menu entity', async () => {
      const menu = await menuController.getOne(saved_entity.uuid);
      expect(menu).toEqual(saved_entity);
    });
  });

  describe('update one menu', () => {
    it('should update a menu entity', async () => {
      const menuList = await menuController.getAll();
      const menu = menuList[0];
      const menuDto2 = Object.assign(
        { category_uuid: menu.category_uuid },
        menuValue2,
      );
      await menuController.putOne(menu.uuid, menuDto2, '');
      const updated_entity = await menuController.getOne(menu.uuid);
      const {
        category_uuid,
        name,
        price,
        description,
        is_main_menu,
        like,
        hate,
      } = updated_entity;
      expect({
        category_uuid: category_uuid,
        name: name,
        price: price,
        description: description,
        is_main_menu: is_main_menu,
        like: like,
        hate: hate,
      }).toEqual(menuDto2);
    });
  });

  describe('delete one menu', () => {
    it('should delete a menu entity', async () => {
      const menuList = await menuController.getAll();
      const menu = menuList[0];
      expect(await menuController.deleteOne(menu.uuid)).toEqual({
        raw: [],
      });
    });
  });

  describe('delete one category', () => {
    it('should delete a category entity', async () => {
      const categoryList = await categoryController.getAll(false);
      const category = categoryList[0];
      expect(await categoryController.deleteOne('', category.uuid)).toEqual({
        raw: [],
      });
    });
  });

  describe('delete one store', () => {
    it('should delete a store entity', async () => {
      const storeList = await storeController.getAll(false, false);
      const store = storeList[0];
      expect(await storeController.deleteOne(store.uuid)).toEqual({
        raw: [],
      });
    });
  });
});
