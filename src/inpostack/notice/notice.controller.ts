import { Controller } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {}
