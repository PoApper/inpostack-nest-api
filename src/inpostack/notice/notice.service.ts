import { Injectable } from '@nestjs/common';
import {NoticeDto} from "./notice.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Notice} from "./notice.entity";
import {Repository} from "typeorm";

@Injectable()
export class NoticeService {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepo: Repository<Notice>
    ) {
    }

    async save(dto: NoticeDto) {
        const saveDto = Object.assign({ updated_at: new Date() }, dto);
        return this.noticeRepo.save(saveDto);
    }

    find(findOptions?: object) {
        return this.noticeRepo.find(findOptions);
    }

    findOne(findOptions?: object) {
        return this.noticeRepo.findOne(findOptions);
    }

    update(findOptions: object, dto: NoticeDto) {
        return this.noticeRepo.update(findOptions, dto);
    }

    delete(findOptions: object) {
        return this.noticeRepo.delete(findOptions);
    }
}
