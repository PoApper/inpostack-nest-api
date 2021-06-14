import { StoreController } from "./store.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./store.entity";
import { StoreService } from "./store.service";
import { StoreDto } from "./store.dto";

describe("Store Controller", () => {
  let storeController: StoreController;
  let storeModule: TestingModule;

  const storeDto1: StoreDto = {
    name: "참서리",
    phone: "010-0000-0000",
    description: "참서리에요~",
    location: "효자동",
    open_time: 1200,
    close_time: 1800,
    menu: JSON.parse("{\"name\": \"food\"}")
  };

  const storeDto2: StoreDto = {
    name: "참서리2",
    phone: "010-1111-1111",
    description: "참서리에요~!",
    location: "효자동.",
    open_time: 1230,
    close_time: 1830,
    menu: JSON.parse("{\"name\": \"food2\"}")
  };

  beforeAll(async () => {
    storeModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Store],
          synchronize: true
        }),
        TypeOrmModule.forFeature([Store])
      ],
      controllers: [StoreController],
      providers: [StoreService]
    }).compile();

    storeController = storeModule.get<StoreController>(StoreController);
  });

  afterAll(async () => {
    storeModule.close();
  });

  describe("get empty", () => {
    it("should return empty arr", async () => {
      expect(await storeController.get())
        .toEqual([]);
    });
  });

  describe("save one store", () => {
    let saved_entity;

    it("should create a store entity", async () => {
      saved_entity = await storeController.post(storeDto1);
      const { name, phone, description, location, open_time, close_time, menu } = saved_entity;

      expect({
        name: name,
        phone: phone,
        description: description,
        location: location,
        open_time: open_time,
        close_time: close_time,
        menu: menu
      })
        .toEqual(storeDto1);
    });
    it("should get a store entity", async () => {
      const exist_user = await storeController.getOne(saved_entity.uuid);
      expect(exist_user).toEqual(saved_entity);
    });
  });

  describe("update one store", () => {
    it("should update a store entity", async () => {
      const exist_users = await storeController.get();
      const exist_user = exist_users[0];
      await storeController.put(exist_user.uuid, storeDto2);
      const updated_user = await storeController.getOne(exist_user.uuid);
      const { name, phone, description, location, open_time, close_time, menu } = updated_user;
      const tempDto: StoreDto = {
        name: name,
        phone: phone,
        description: description,
        location: location,
        open_time: open_time,
        close_time: close_time,
        menu: menu
      };
      expect(tempDto)
        .toEqual(storeDto2);
    });
  });

  describe("delete one store", () => {
    it("should delete a store entity", async () => {
      const exist_users = await storeController.get();
      const exist_user = exist_users[0];

      expect(await storeController.delete(exist_user.uuid))
        .toEqual({ raw: [] });
    });
  });
});