import {NoticeType} from "./notice.meta";
import {ApiProperty} from "@nestjs/swagger";

export class NoticeDto{
    @ApiProperty({type: String, description: 'notice title'})
    readonly title: string;
    @ApiProperty({type: String, description: 'notice body content'})
    readonly content: string;
    @ApiProperty({type: String, description: 'notice type(GLOBAL/STORE-OWNER/USER)'})
    readonly notice_type: NoticeType;
}