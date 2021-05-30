import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {NoticeType} from "./notice.meta";

@Entity()
export class Notice {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({nullable: false})
    title: string;

    @Column("text", {nullable: false})
    content: string;

    @Column()
    notice_type: NoticeType;

    @Column()
    views: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
