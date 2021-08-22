import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { Notice } from './notice.entity';
import { noticeDto1 } from '../../../test/test_values';

describe('Notice Controller', () => {
  let noticeController: NoticeController;
  let noticeModule: TestingModule;

  beforeAll(async () => {
    noticeModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Notice],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Notice]),
      ],
      controllers: [NoticeController],
      providers: [NoticeService],
    }).compile();

    noticeController = noticeModule.get<NoticeController>(NoticeController);
  });

  afterAll(() => {
    noticeModule.close();
  });

  describe('get empty', () => {
    it('should return empty arr', async () => {
      expect(await noticeController.get()).toEqual([]);
    });
  });

  describe('save one store', () => {
    let saved_entity;

    it('should create a notice entity', async () => {
      saved_entity = await noticeController.post(noticeDto1);
      const { title, content, notice_type } = saved_entity;
      expect({
        title: title,
        content: content,
        notice_type: notice_type,
      }).toEqual(noticeDto1);
    });

    it('should get a saved entity', async () => {
      const exist_notice = await noticeController.getOne(saved_entity.uuid);
      expect(exist_notice).toEqual(saved_entity);
    });
  });
});
