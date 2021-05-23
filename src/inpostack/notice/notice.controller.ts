import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {NoticeService} from "./notice.service";
import {NoticeDto} from "./notice.dto";

@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {
    }

    @Post()
    post(@Body() dto: NoticeDto) {
        return this.noticeService.save(dto);
    }

    @Get()
    get() {
        return this.noticeService.find({order: {createAt: "DESC"}});
    }

    @Get("uuid")
    getOne(@Param("uuid") uuid: string) {
        return this.noticeService.findOne({uuid: uuid});
    }

    @Put("uuid")
    put(@Param("uuid") uuid: string, @Body() dto: NoticeDto) {
        return this.noticeService.update({uuid: uuid}, dto);
    }

    @Delete("uuid")
    delete(@Param("uuid") uuid: string) {
        return this.noticeService.delete({uuid: uuid});
    }
}
