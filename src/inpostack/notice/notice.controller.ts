import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {NoticeService} from "./notice.service";
import {NoticeDto} from "./notice.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {
    }

    @Post()
    @ApiOperation({summary: 'create notice API', description: 'create a new notice'})
    post(@Body() dto: NoticeDto) {
        return this.noticeService.save(dto);
    }

    @Get()
    @ApiOperation({summary: 'get all notice API', description: 'get whole notices'})
    get() {
        return this.noticeService.find({order: {created_at: "DESC"}});
    }

    @Get(":uuid")
    @ApiOperation({summary: 'get specific notice API', description: 'get a specific notice using uuid'})
    getOne(@Param("uuid") uuid: string) {
        return this.noticeService.findOne({uuid: uuid});
    }

    @Put(":uuid")
    @ApiOperation({summary: 'update notice API', description: 'update a specific notice using uuid'})
    put(@Param("uuid") uuid: string, @Body() dto: NoticeDto) {
        return this.noticeService.update({uuid: uuid}, dto);
    }

    @Delete(":uuid")
    @ApiOperation({summary: 'delete notice API', description: 'delete a specific notice using uuid'})
    delete(@Param("uuid") uuid: string) {
        return this.noticeService.delete({uuid: uuid});
    }
}
