import {StoreController} from "./store.controller";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Store} from "./store.entity";
import {StoreService} from "./store.service";

describe('Store Controller', () => {
    let storeController: StoreController;
    let storeModule: TestingModule;

    const storeDto1 = {
        name: "참서리",
        phone: "010-0000-0000",
        desc: "참서리에요~",
        location: "효자동",
        openTime: 1200,
        closeTime: 1800,
        menu: JSON.parse('{"name": "food"}')
    };

    const storeDto2 = {
        name: "참서리2",
        phone: "010-1111-1111",
        desc: "참서리에요~!",
        location: "효자동.",
        openTime: 1230,
        closeTime: 1830,
        menu: JSON.parse('{"name": "food2"}')
    };

    beforeAll(async () => {
         storeModule = await Test.createTestingModule({
             imports: [
                 TypeOrmModule.forRoot({
                     type: "sqlite",
                     database: ':memory:',
                     entities: [Store],
                     synchronize: true,
                 }),
                 TypeOrmModule.forFeature([Store]),
             ],
             controllers: [StoreController],
             providers: [StoreService],
        }).compile();

         storeController = storeModule.get<StoreController>(StoreController);
    });

    afterAll(async () => {
        storeModule.close();
    })

    describe('get empty', () => {
        it('should return empty arr', async () => {
            expect(await storeController.get())
                .toEqual([]);
        });
    });

    describe('save one store', () => {
        it('should create a store entity', async () => {
            const saved_user = await storeController.post(storeDto1);
            const {name, phone, desc, location, openTime, closeTime, menu} = saved_user;
            const tempDto = {
                name: name,
                phone: phone,
                desc: desc,
                location: location,
                openTime: openTime,
                closeTime: closeTime,
                menu: menu
            }
            expect(tempDto)
                .toEqual({
                    name: "참서리",
                    phone: "010-0000-0000",
                    desc: "참서리에요~",
                    location: "효자동",
                    openTime: 1200,
                    closeTime: 1800,
                    menu: JSON.parse('{"name": "food"}')
                })
        })
        it('should get a store entity', async () => {
            const exist_users = await storeController.get()
            const exist_user = exist_users[0]
            const saved_user = await storeController.getOne(exist_user.uuid)
            const {name, phone, desc, location, openTime, closeTime} = saved_user;
            const tempDto = {
                name: name,
                phone: phone,
                desc: desc,
                location: location,
                openTime: openTime,
                closeTime: closeTime
            }

            expect(tempDto)
                .toEqual({
                    name: "참서리",
                    phone: "010-0000-0000",
                    desc: "참서리에요~",
                    location: "효자동",
                    openTime: 1200,
                    closeTime: 1800
                })
        })
    })

    describe('update one store', () => {
        it('should update a store entity', async () => {
            const exist_users = await storeController.get()
            const exist_user = exist_users[0]
            expect(await storeController.put(exist_user.uuid, storeDto2))
                .toEqual({
                    name: "참서리2",
                    phone: "010-1111-1111",
                    desc: "참서리에요~!",
                    location: "효자동.",
                    openTime: 1230,
                    closeTime: 1830,
                    menu: JSON.parse('{"name": "food2"}')
                })
        })
    })

    describe('delete one store', () => {
        it('should delete a store entity', async () => {
            const exist_users = await storeController.get()
            const exist_user = exist_users[0]

            expect(await storeController.delete(exist_user.uuid))
                .toEqual({ raw: [] });
        })
    })
})