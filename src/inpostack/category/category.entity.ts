import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Store } from "../store/store.entity";
import { Menu } from "../menu/menu.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @ManyToOne(() => Store, store => store.category)
  store: Store;

  @OneToMany(() => Menu, menu => menu.category)
  menu: Menu[];

}