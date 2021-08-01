import { StoreController } from './store.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { StoreDto } from './store.dto';
import { StoreType } from './store.meta';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/category.entity';
import { Menu } from '../menu/menu.entity';
import { Account } from '../account/account.entity';

describe('Store Controller', () => {
  let storeController: StoreController;
  let storeModule: TestingModule;

  const storeDto1: StoreDto = {
    name: '무은재기념관',
    phone: '010-0000-0000',
    description: '학문에는 경계가 없다',
    store_type: StoreType.korean,
    address1: '경상북도 포항시 남구 청암로 77(지곡동)',
    address2: '기숙사 1동 101호',
    zipcode: 12345,
    open_time: '12:00',
    close_time: '18:00',
  };

  const storeDto2: StoreDto = {
    name: '박태준 학술정보관',
    phone: '010-1111-1111',
    description: '자원은 유한하지만, 창의는 무한하다',
    store_type: StoreType.korean,
    address1: '경상북도 포항시 남구 청암로 77(지곡동)',
    address2: '기숙사 1동 101호',
    zipcode: 12345,
    open_time: '12:30',
    close_time: '18:30',
  };

  beforeAll(async () => {
    storeModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Store, Category, Menu, Account],
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
      saved_entity = await storeController.post(storeDto1, "");
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
      const exist_user = await storeController.getOne(
        saved_entity.uuid,
        false,
        false,
      );
      expect(exist_user).toEqual(saved_entity);
    });
  });

  describe('update one store', () => {
    it('should update a store entity', async () => {
      const exist_users = await storeController.getAll(false, false);
      const exist_user = exist_users[0];
      await storeController.putOne(exist_user.uuid, storeDto2, "");
      const updated_user = await storeController.getOne(
        exist_user.uuid,
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
      const exist_users = await storeController.getAll(false, false);
      const exist_user = exist_users[0];

      expect(await storeController.deleteOne(exist_user.uuid)).toEqual({
        raw: [],
      });
    });
  });
});
