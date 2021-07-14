import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { AccountStatus, AccountType } from "./account.meta";
import { Store } from '../store/store.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({nullable: true})
  email: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  id: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  crypto_salt: string;

  @Column({nullable: false})
  account_type: AccountType;

  @Column({nullable: false, default: AccountStatus.deactivated})
  account_status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  last_login_at: Date;

  /**
   * Database Relationship
   */

  @OneToOne(() => Store, store => store.owner)
  store: Store;

}