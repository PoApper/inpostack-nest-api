import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticeController } from "./notice.controller";
import { NoticeService } from "./notice.service";
import { Notice } from "./notice.entity";
import { NoticeDto } from "./notice.dto";
import { NoticeType } from "./notice.meta";

describe("Notice Controller", () => {
  let noticeController: NoticeController;
  let noticeModule: TestingModule;

  const noticeDto1: NoticeDto = {
    title: "테스트 공지",
    content: "테스트 공지입니다.",
    notice_type: NoticeType.global
  };

  beforeAll(async () => {
    noticeModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Notice],
          synchronize: true
        }),
        TypeOrmModule.forFeature([Notice])
      ],
      controllers: [NoticeController],
      providers: [NoticeService]
    }).compile();

    noticeController = noticeModule.get<NoticeController>(NoticeController);
  });

  afterAll(() => {
    noticeModule.close();
  });

  describe("get empty", () => {
    it("should return empty arr", async () => {
      expect(await noticeController.get())
        .toEqual([]);
    });
  });

  describe("save one store", () => {
    let saved_entity;

    it("should create a notice entity", async () => {
      saved_entity = await noticeController.post(noticeDto1);
      const { title, content, notice_type } = saved_entity;
      expect({
        title: title,
        content: content,
        notice_type: notice_type
      }).toEqual(noticeDto1);
    });

    it("should get a saved entity", async () => {
      const exist_notice = await noticeController.getOne(saved_entity.uuid);
      expect(exist_notice).toEqual(saved_entity);
    })

  });

});