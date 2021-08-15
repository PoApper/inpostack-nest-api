import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { AccountStatus, AccountType } from './account.meta';
import { Store } from '../market/store/store.entity';
import { Review } from '../market/review/review.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  id: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  crypto_salt: string;

  @Column({ nullable: false })
  account_type: AccountType;

  @Column({ nullable: false, default: AccountStatus.deactivated })
  account_status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  last_login_at: Date;

  /**
   * Database Relationship
   */

  @OneToOne(() => Store, (store) => store.owner)
  store: Store;

  @OneToMany(() => Review, (review) => review.reviewer)
  review: Review[];
}
