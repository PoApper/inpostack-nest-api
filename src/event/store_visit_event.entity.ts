import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StoreVisit {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true })
  user_uuid: string;

  @Column({ nullable: false })
  store_uuid: string;

  @CreateDateColumn()
  visited_at: Date;
}
