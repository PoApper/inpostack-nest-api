import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/category.entity';
import { Store } from '../../store/entity/store.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column('text')
  description: string;

  @Column({ nullable: false, default: false })
  is_main_menu: boolean;

  @Column({ nullable: false, default: 0 })
  like: number;

  @Column({ nullable: false, default: 0 })
  hate: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: false })
  store_uuid: string;

  @Column({ nullable: true })
  category_uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @ManyToOne(() => Store, (store) => store.menu)
  @JoinColumn({ name: 'store_uuid' })
  store: Store;

  @ManyToOne(() => Category, (category) => category.menu)
  @JoinColumn({ name: 'category_uuid' })
  category: Category;
}
