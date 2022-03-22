import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeDto } from './notice.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeType } from './notice.meta';
import { InPoStackAuth } from '../../auth/guard/InPoStackAuth.guard';
import { AccountTypeGuard } from '../../auth/guard/role.guard';
import { AccountTypes } from '../../auth/decorator/role.decorator';
import { AccountType } from '../account/account.meta';
import { Public } from 'nest-keycloak-connect';

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @ApiOperation({
    summary: 'create notice API',
    description: 'create a new notice',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  post(@Body() dto: NoticeDto) {
    return this.noticeService.save(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'get all notice API',
    description: 'get whole notices',
  })
  @Public()
  get() {
    return this.noticeService.find({ order: { created_at: 'DESC' } });
  }

  @Get('meta')
  @ApiOperation({
    summary: 'get notice meta API',
    description: 'get notice meta data',
  })
  @Public()
  getMeta() {
    return {
      notice_type: NoticeType,
    };
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'get specific notice API',
    description: 'get a specific notice using uuid',
  })
  @Public()
  getOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.noticeService.findOne({ uuid: uuid });
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update notice API',
    description: 'update a specific notice using uuid',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  updateOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: NoticeDto,
  ) {
    return this.noticeService.update({ uuid: uuid }, dto);
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'delete notice API',
    description: 'delete a specific notice using uuid',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  deleteOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.noticeService.delete({ uuid: uuid });
  }
}
