import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
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

  @Column({ nullable: true, type: 'text' })
  opening_hours: string; // JSON string, refer annotation below

  @Column({ nullable: true })
  open_time: string; // HH:MM

  @Column({ nullable: true })
  close_time: string; // HH:MM

  @Column({ nullable: true })
  owner_uuid: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 0 })
  visit_count: number;

  @Column({ default: 0, comment: 'unit: meter' })
  distance: number; // unit: meter

  @Column({ nullable: true })
  naver_map_url: string;

  @Column({ nullable: true })
  kakao_map_url: string;

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

/*
* opening_hours input example: JSON string
*   "{\"Monday\":[{\"startTime\":\"09:00\",\"endTime\":\"14:00\"},{\"startTime\":\"17:00\",\"endTime\":\"19:30\"}],\"Tuesday\":[{\"startTime\":\"09:00\",\"endTime\":\"14:00\"},{\"startTime\":\"17:00\",\"endTime\":\"19:30\"}]}"
*
* use JSON.parse() to convert JSON string -> JSON
* */
