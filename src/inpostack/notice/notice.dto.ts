import {NoticeType} from "./notice.meta";

export class NoticeDto{
    readonly title: string;
    readonly content: string;
    readonly noticeType: NoticeType;
}