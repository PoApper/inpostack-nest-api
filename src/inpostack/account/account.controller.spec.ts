import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { userDto1, userDto2 } from '../../../test/test_values';
import { Store } from '../market/store/entity/store.entity';
import { Review } from '../market/review/review.entity';
import { Category } from '../market/category/category.entity';
import { Menu } from '../market/menu/entity/menu.entity';
import { LoggerModule } from '../../logger/logger.module';

describe('Account Controller', () => {
  let accountController: AccountController;
  let accountModule: TestingModule;

  beforeAll(async () => {
    accountModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Account, Store, Review, Category, Menu],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Account]),
        LoggerModule,
      ],
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();

    accountController = accountModule.get<AccountController>(AccountController);
  });

  afterAll(() => {
    accountModule.close();
  });

  describe('get empty', () => {
    it('should return empty arr', async () => {
      expect(await accountController.get()).toEqual([]);
    });
  });

  describe('save one account', () => {
    let saved_entity;

    it('should create a account entity', async () => {
      saved_entity = await accountController.post(userDto1);
      const { email, name, id, account_type, account_status } = saved_entity;
      expect({
        email: email,
        name: name,
        id: id,
        account_type: account_type,
        account_status: account_status,
      }).toEqual({
        email: userDto1.email,
        name: userDto1.name,
        id: userDto1.id,
        account_type: userDto1.account_type,
        account_status: userDto1.account_status,
      });
    });

    it('should get a account entity', async () => {
      const account = await accountController.getOne(saved_entity.uuid);
      expect(account).toEqual(saved_entity);
    });
  });

  describe('update one account', () => {
    it('should update a account entity', async () => {
      const accounts = await accountController.get();
      const account = accounts[0];
      await accountController.updateByAdmin(account.uuid, userDto2);
      const updated_user = await accountController.getOne(account.uuid);
      const { email, name, id, account_type, account_status } = updated_user;
      expect({
        email: email,
        name: name,
        id: id,
        account_type: account_type,
        account_status: account_status,
      }).toEqual({
        email: updated_user.email,
        name: updated_user.name,
        id: updated_user.id,
        account_type: updated_user.account_type,
        account_status: updated_user.account_status,
      });
    });
  });

  describe('delete one account', () => {
    it('should delete a account entity', async () => {
      const accounts = await accountController.get();
      const account = accounts[0];

      expect(await accountController.delete(account.uuid)).toEqual({
        raw: [],
      });
    });
  });
});
