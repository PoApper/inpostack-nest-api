import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';
import { Account } from '../../account/account.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('text')
  content: string;

  @Column({ nullable: false })
  reviewer_uuid: string;

  @Column({ nullable: false })
  store_uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @ManyToOne(() => Account, (reviewer) => reviewer.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewer_uuid' })
  reviewer: Account;

  @ManyToOne(() => Store, (store) => store.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_uuid' })
  store: Store;
}
