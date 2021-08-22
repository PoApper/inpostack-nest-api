import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/category.entity';
import { Menu } from '../menu/menu.entity';
import { Account } from '../../account/account.entity';
import { Review } from '../review/review.entity';
import { storeDto1, storeDto2 } from '../../../../test/test_values';

describe('Store Controller', () => {
  let storeController: StoreController;
  let storeModule: TestingModule;

  beforeAll(async () => {
    storeModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Store, Category, Menu, Account, Review],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Store]),
        CategoryModule,
      ],
      controllers: [StoreController],
      providers: [StoreService],
    }).compile();

    storeController = storeModule.get<StoreController>(StoreController);
  });

  afterAll(() => {
    storeModule.close();
  });

  describe('get empty', () => {
    it('should return empty arr', async () => {
      expect(await storeController.getAll()).toEqual([]);
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
        saved_entity.uuid,
        false,
        false,
      );
      expect(store).toEqual(saved_entity);
    });
  });

  describe('update one store', () => {
    it('should update a store entity', async () => {
      const stores = await storeController.getAll(false, false);
      const store = stores[0];
      await storeController.updateOne(store.uuid, storeDto2, '');
      const updated_user = await storeController.getOne(
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
      } = updated_user;
      const tempDto: StoreDto = {
        name: name,
        phone: phone,
        description: description,
        store_type: store_type,
        address1: address1,
        address2: address2,
        zipcode: zipcode,
        open_time: open_time,
        close_time: close_time,
      };
      expect(tempDto).toEqual(storeDto2);
    });
  });

  describe('delete one store', () => {
    it('should delete a store entity', async () => {
      const stores = await storeController.getAll(false, false);
      const store = stores[0];

      expect(await storeController.deleteOne(store.uuid)).toEqual({
        raw: [],
      });
    });
  });
});
