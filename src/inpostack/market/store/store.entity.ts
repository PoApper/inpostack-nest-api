import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StoreType } from './store.meta';
import { Category } from '../category/category.entity';
import { Account } from '../../account/account.entity';
import { Menu } from '../menu/menu.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column('text')
  description: string;

  @Column({ nullable: false, default: StoreType.etc })
  store_type: StoreType;

  @Column({ nullable: false })
  address1: string;

  @Column({ nullable: false })
  address2: string;

  @Column({ nullable: false })
  zipcode: number;

  @Column({ nullable: false })
  open_time: string; // HH:MM

  @Column({ nullable: false })
  close_time: string; // HH:MM

  @Column({ nullable: true })
  owner_uuid: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 0 })
  visit_count: number;

  // TODO: distance 컬럼 추가, default: 0, 단위는
  @Column({ default: 0, comment: 'unit: meter' })
  distance: number; // unit: meter

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @OneToOne(() => Account, (account) => account.store)
  @JoinColumn({ name: 'owner_uuid' })
  owner: Account;

  @OneToMany(() => Category, (category) => category.store)
  category: Category[];

  @OneToMany(() => Menu, (menu) => menu.store)
  menu: Menu[];

  @OneToMany(() => Menu, (menu) => menu.store)
  review: Menu[];
}
