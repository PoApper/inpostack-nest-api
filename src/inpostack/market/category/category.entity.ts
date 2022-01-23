import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../store/entity/store.entity';
import { Menu } from '../menu/entity/menu.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  store_uuid: string;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @ManyToOne(() => Store, (store) => store.category)
  @JoinColumn({ name: 'store_uuid' })
  store: Store;

  @OneToMany(() => Menu, (menu) => menu.category)
  menu: Menu[];
}
